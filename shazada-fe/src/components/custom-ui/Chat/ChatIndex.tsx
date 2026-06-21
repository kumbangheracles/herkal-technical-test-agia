import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { X, Send, ShoppingBag, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface PropTypes {
  openChat: boolean;
  setOpenChat: (val: boolean) => void;
}

interface ProductType {
  id: string | number;
  title: string;
  price: number;
  image_url: string;
}

const ChatIndex = ({ openChat, setOpenChat }: PropTypes) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const sessionCreationStarted = useRef(false);

  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionCreationStarted.current) return;
    sessionCreationStarted.current = true;

    const initSession = async () => {
      const supabase = createSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNeedsLogin(true);
        return;
      }

      const { data: existingSession, error: findError } = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findError) {
        setNeedsLogin(true);
        return;
      }

      let activeSessionId = existingSession?.id ?? null;

      if (!activeSessionId) {
        // Belum ada sesi → buat baru
        const { data: newSession, error: insertError } = await supabase
          .from("chat_sessions")
          .insert({
            user_id: user.id,
            user_email: user.email ?? null,
          })
          .select("id")
          .single();

        if (insertError) {
          setNeedsLogin(true);
          return;
        }

        activeSessionId = newSession.id;
      } else {
        // Sesi sudah ada → load histori pesan
        const { data: oldMessages, error: messagesError } = await supabase
          .from("chat_messages")
          .select("id, role, content")
          .eq("session_id", activeSessionId)
          .order("created_at", { ascending: true });

        if (!messagesError && oldMessages && oldMessages.length > 0) {
          const converted: UIMessage[] = oldMessages
            .filter((m) => m.content)
            .map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant" | "system",
              parts: [{ type: "text", text: m.content as string }],
            }));

          // ✅ Kunci perbaikan: pakai setMessages dari hook, bukan state terpisah.
          // useChat hanya membaca prop `messages` sekali saat mount (bukan reactive),
          // jadi satu-satunya cara mengisi histori setelah load async adalah lewat setMessages.
          setMessages(converted);
        }
      }

      setSessionId(activeSessionId);
    };

    initSession();
  }, [setMessages]);

  const isSessionReady = sessionId !== null;
  const isLoading = status !== "ready";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isSessionReady) return;

    const messageToSend = input;
    setInput("");

    sendMessage({ text: messageToSend }, { body: { sessionId } });
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-background/80 backdrop-blur-md rounded-2xl shadow-xl border border-border/50">
      <div className="font-semibold font-mono flex-shrink-0 flex items-center justify-between p-4 w-full bg-background/40 backdrop-blur-xl z-30 border-b border-border/60">
        <h4 className="text-sm sm:text-[15px] text-foreground tracking-wider">
          Shazada's bot
        </h4>
        <button
          type="button"
          className="p-2 rounded-full h-8 w-8 flex items-center justify-center z-40 transition-all hover:bg-muted bg-muted/50 border border-border/50 cursor-pointer shadow-sm text-foreground"
          onClick={() => setOpenChat(false)}
        >
          <X size={18} />
        </button>
      </div>

      {needsLogin ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <LogIn size={28} className="text-muted-foreground" />
          <p className="text-sm text-foreground font-medium">
            Please login terlebih dahulu
          </p>
          <p className="text-xs text-muted-foreground max-w-[260px]">
            Kamu perlu login untuk mulai mengobrol dengan Shazada's bot.
          </p>
          <Link
            href="/auth/login"
            className="mt-2 text-xs font-semibold px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Login sekarang
          </Link>
        </div>
      ) : (
        <>
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto custom-scrollbar font-mono p-4 pb-4 space-y-4 min-h-0"
          >
            {messages.length === 0 && (
              <div className="text-center text-sm mt-10 text-muted-foreground">
                {isSessionReady
                  ? "Send a message to start a dialogue"
                  : "Menyiapkan sesi chat..."}
              </div>
            )}

            {messages.map((m: UIMessage) => (
              <div
                key={m.id}
                className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                {m.parts?.map((part: any, index: number) => {
                  if (part.type === "text") {
                    if (!part.text) return null;
                    return (
                      <div
                        key={index}
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[10px] sm:text-[15px] shadow-sm backdrop-blur-sm ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted/80 text-foreground rounded-bl-sm border border-border/50"
                        }`}
                      >
                        <p className="whitespace-pre-wrap wrap-break-word">
                          {part.text}
                        </p>
                      </div>
                    );
                  }

                  if (part.type === "tool-searchProducts") {
                    const toolCallId = part.toolCallId ?? index;

                    if (
                      part.state === "input-streaming" ||
                      part.state === "input-available"
                    ) {
                      return (
                        <div
                          key={toolCallId}
                          className="mt-1 flex items-center gap-2 text-xs text-muted-foreground animate-pulse"
                        >
                          <ShoppingBag size={14} />
                          <span>Mencari produk yang sesuai...</span>
                        </div>
                      );
                    }

                    if (part.state === "output-error") {
                      return (
                        <div
                          key={toolCallId}
                          className="mt-1 text-xs text-destructive"
                        >
                          Terjadi kesalahan saat mencari produk.
                        </div>
                      );
                    }

                    if (part.state === "output-available") {
                      const products = part.output?.products as
                        | ProductType[]
                        | null;

                      if (!products || products.length === 0) {
                        return (
                          <div
                            key={toolCallId}
                            className="mt-1 text-xs italic text-muted-foreground"
                          >
                            Maaf, produk tidak ditemukan.
                          </div>
                        );
                      }

                      return (
                        <div
                          key={toolCallId}
                          className="mt-2 flex gap-3 overflow-x-auto custom-scrollbar pb-2 w-full max-w-[90%] snap-x"
                        >
                          {products.map((prod) => (
                            <div
                              key={prod.id}
                              className="snap-center shrink-0 w-[140px] flex flex-col bg-card/90 text-card-foreground border border-border/60 rounded-xl overflow-hidden shadow-sm backdrop-blur-md transition-transform hover:scale-[1.02] hover:border-primary/50"
                            >
                              <div className="w-full h-24 relative bg-muted/50">
                                <Image
                                  src={
                                    prod.image_url || "/images/default-img.png"
                                  }
                                  alt={prod.title ?? "default-img"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-2.5 flex flex-col gap-1">
                                <p className="text-[11px] sm:text-xs font-semibold truncate">
                                  {prod.title}
                                </p>
                                <p className="text-[10px] sm:text-xs font-bold text-primary">
                                  Rp {prod.price.toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            ))}

            {error && (
              <div className="text-center text-sm text-destructive py-2">
                shazada's bot is busy, pls try again later.
              </div>
            )}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-muted/80 backdrop-blur-sm border border-border/50 text-muted-foreground rounded-2xl rounded-bl-sm px-4 py-2 text-sm shadow-sm">
                  <span className="animate-pulse">typing . . .</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
            <form onSubmit={handleFormSubmit}>
              <div className="flex items-center font-mono gap-2 w-full p-1 pl-4 rounded-full border border-border bg-background/50 backdrop-blur-md shadow-lg transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading || !isSessionReady}
                  placeholder={
                    isSessionReady
                      ? "Type a message . . ."
                      : "Menyiapkan sesi..."
                  }
                  className="flex-1 bg-transparent py-2 outline-none text-foreground placeholder:text-muted-foreground text-[10px] sm:text-[15px]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || !isSessionReady}
                  className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatIndex;
