import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { messages, sessionId }: { messages: UIMessage[]; sessionId?: string } =
    await req.json();

  // sessionId WAJIB ada. Sesi dibuat di client (ChatIndex) sebelum pesan
  // pertama dikirim, jadi kalau ini kosong berarti ada bug di client,
  // bukan kondisi normal yang boleh dilewatkan diam-diam.
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "sessionId wajib dikirim" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = await createSupabaseServerClient();
  // Insert chat_messages tidak diizinkan untuk anon/authenticated lewat RLS
  // (lihat migration_chat.sql), jadi pakai service role di sini supaya guest
  // pun tetap bisa kesimpan histori chat-nya.
  const supabaseAdmin = createSupabaseAdminClient();

  // Simpan pesan user TERAKHIR (yang baru saja dikirim dari client) ke DB
  // sebelum diproses AI. `messages` dari useChat selalu berisi seluruh
  // histori, jadi kita ambil elemen paling akhir saja.
  const lastUserMessage = messages[messages.length - 1];
  if (lastUserMessage?.role === "user") {
    const userText = lastUserMessage.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("\n");

    if (userText) {
      const { error: insertUserError } = await supabaseAdmin
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          role: "user",
          content: userText,
        });

      if (insertUserError) {
        console.error("Gagal simpan pesan user:", insertUserError.message);
        // Tidak menghentikan request — chat tetap harus jalan walau gagal
        // simpan history, supaya UX tidak rusak gara-gara masalah DB.
      }
    }
  }

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const result = streamText({
    model: google("gemini-flash-latest"),
    // useChat mengirim UIMessage[] (punya `parts`), sedangkan streamText
    // butuh ModelMessage[]. convertToModelMessages menjembatani keduanya.
    // PENTING: convertToModelMessages bersifat async, jadi WAJIB di-await —
    // kalau tidak, "messages" akan berisi objek Promise, bukan array,
    // dan akan muncul error "messages.some is not a function".
    messages: await convertToModelMessages(messages),
    system:
      "Kamu adalah asisten toko shazada yang ramah. Berikan rekomendasi produk berdasarkan data yang ada di database menggunakan tool searchProducts. Jangan pernah mengarang produk yang tidak ada di hasil pencarian.",
    // Default-nya model berhenti setelah 1 step (langsung berhenti setelah
    // memanggil tool, tanpa sempat menulis balasan). stepCountIs(5) mengizinkan
    // model memanggil tool LALU menulis teks balasan berdasarkan hasilnya.
    stopWhen: stepCountIs(5),
    tools: {
      searchProducts: tool({
        description: "Cari produk di database berdasarkan nama atau kategori",
        // v5: "parameters" -> "inputSchema"
        inputSchema: z.object({
          keyword: z
            .string()
            .describe(
              "Kata kunci pencarian produk, biarkan kosong jika mencari semua produk",
            ),
        }),
        execute: async ({ keyword }) => {
          // products bisa dibaca public (RLS "Public can view products"),
          // jadi aman pakai server client biasa, tidak perlu admin.
          const { data, error } = await supabase
            .from("products")
            .select("id, title, price, image_url, description")
            .ilike("title", `%${keyword}%`)
            .limit(4);

          if (error) {
            return {
              products: null,
              error: error.message,
            };
          }

          return {
            products: data,
            error: null,
          };
        },
      }),
    },
    onFinish: async ({ text, toolCalls, toolResults }) => {
      const { error: insertAssistantError } = await supabaseAdmin
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          role: "assistant",
          content: text,
          tool_invocations:
            toolCalls.length > 0
              ? JSON.stringify({ toolCalls, toolResults })
              : null,
        });

      if (insertAssistantError) {
        console.error(
          "Gagal simpan pesan assistant:",
          insertAssistantError.message,
        );
      }
    },
  });

  // v5: toDataStreamResponse() -> toUIMessageStreamResponse()
  return result.toUIMessageStreamResponse();
}
