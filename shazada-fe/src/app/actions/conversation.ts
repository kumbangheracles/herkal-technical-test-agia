"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface ConversationProps {
  id: string;
  user_email: string | null;
  created_at: string;
  updated_at: string;
  chat_messages: { count: number }[];
}

export interface GetConversationsResult {
  data: ConversationProps[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  error?: string;
  sortOrder: "newest" | "oldest";
}

export async function getConversationsAction(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortOrder: "newest" | "oldest" = "newest",
): Promise<GetConversationsResult> {
  const supabase = createSupabaseAdminClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("chat_sessions")
    .select("id, user_email, created_at, updated_at, chat_messages(count)", {
      count: "exact",
    })
    .order("updated_at", { ascending: sortOrder === "oldest" });

  if (search) {
    query = query.ilike("user_email", `%${search}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      error: error.message,
      sortOrder,
    };
  }

  return {
    data: data as unknown as ConversationProps[],
    totalCount: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / pageSize),
    currentPage: page,
    sortOrder,
  };
}
