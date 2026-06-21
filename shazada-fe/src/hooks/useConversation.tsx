"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
// sesuaikan path sesuai lokasi action di project kamu
import { ColumnDef, ColumnHandlers } from "@/components/custom-ui/AppTable";
import {
  ConversationProps,
  getConversationsAction,
} from "@/app/actions/conversation";
import { formatDate } from "@/helpers/format";

export function useConversations(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortOrder: "newest" | "oldest" = "newest",
) {
  const getConversationColumns = ({
    onDetail,
  }: ColumnHandlers<ConversationProps> = {}): ColumnDef<ConversationProps>[] => [
    {
      key: "user_email",
      label: "Pengguna",
      render: (row) => row?.user_email ?? "Guest",
    },
    {
      key: "chat_messages",
      label: "Jumlah Pesan",
      hideOnMobile: true,
      render: (row) => row?.chat_messages?.[0]?.count ?? 0,
    },
    {
      key: "created_at",
      label: "Dibuat",
      hideOnMobile: true,
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "updated_at",
      label: "Terakhir Aktif",
      render: (row) => formatDate(row.updated_at),
    },
    {
      key: "action",
      label: "Action",
      hideOnMobile: false,
      render: (row) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onDetail?.(row)}
        >
          <Eye className="size-4" />
          <span className="sr-only">Lihat detail</span>
        </Button>
      ),
    },
  ];

  const query = useQuery({
    queryKey: ["conversations", page, pageSize, search, sortOrder],
    queryFn: () => getConversationsAction(page, pageSize, search, sortOrder),
  });

  return { query, getConversationColumns };
}
