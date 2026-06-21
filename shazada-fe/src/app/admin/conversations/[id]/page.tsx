import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import AdminLayout from "@/components/custom-ui/AppAdminLayout";

export const dynamic = "force-dynamic";

interface ToolInvocationData {
  toolCalls?: { toolName: string; input?: unknown }[];
  toolResults?: { output?: { products?: { title: string }[] } }[];
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id, user_email, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (!session) notFound();

  // PENTING: kolom yang benar-benar ada di tabel chat_messages adalah
  // `content` (text) dan `tool_invocations` (jsonb) — BUKAN `parts`.
  // `parts` itu struktur dari UIMessage di sisi client/AI SDK, tidak
  // pernah disimpan ke DB dengan nama itu.
  const { data: messages, error: messagesError } = await supabase
    .from("chat_messages")
    .select("id, role, content, tool_invocations, created_at")
    .eq("session_id", id)
    .order("created_at", { ascending: true });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold">
            {session.user_email ?? "Guest (belum login)"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Dibuat {new Date(session.created_at).toLocaleString("id-ID")} •
            Terakhir aktif{" "}
            {new Date(session.updated_at).toLocaleString("id-ID")}
          </p>
        </div>

        {messagesError && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-xl p-4 mb-4">
            Gagal memuat pesan: {messagesError.message}
          </div>
        )}

        <div className="space-y-4">
          {messages?.map((m) => {
            // tool_invocations disimpan sebagai JSON string (lihat route.ts:
            // JSON.stringify({ toolCalls, toolResults })), jadi perlu di-parse.
            let toolData: ToolInvocationData | null = null;
            if (m.tool_invocations) {
              try {
                toolData =
                  typeof m.tool_invocations === "string"
                    ? JSON.parse(m.tool_invocations)
                    : m.tool_invocations;
              } catch {
                toolData = null;
              }
            }

            const products = toolData?.toolResults?.[0]?.output?.products ?? [];

            return (
              <div
                key={m.id}
                className={`flex flex-col gap-1 ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-xs text-muted-foreground">
                  {m.role === "user" ? "Pengguna" : "Bot"} •{" "}
                  {new Date(m.created_at).toLocaleTimeString("id-ID")}
                </span>

                {m.content && (
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                )}

                {products.length > 0 && (
                  <div className="text-xs text-muted-foreground italic">
                    🔍 tool searchProducts → {products.length} produk ditemukan:{" "}
                    {products.map((p) => p.title).join(", ")}
                  </div>
                )}
              </div>
            );
          })}

          {messages?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada pesan di percakapan ini.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
