"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminLayout from "@/components/custom-ui/AppAdminLayout";
import { AppTable } from "@/components/custom-ui/AppTable";
import { useConversations } from "@/hooks/useConversation";

export default function ConversationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { query, getConversationColumns } = useConversations(page);
  const { data, isLoading } = query;

  const conversationColumns = getConversationColumns({
    onDetail: (row) => router.push(`/admin/conversations/${row.id}`),
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-lg font-semibold mb-4">Rekap Percakapan</h1>

        <div className="bg-card/50 backdrop-blur-2xl p-5 rounded-2xl">
          <AppTable
            isLoading={isLoading}
            data={data?.data ?? []}
            columns={conversationColumns}
            searchPlaceholder="Cari berdasarkan email..."
            totalPages={data?.totalPages ?? 1}
            totalData={data?.totalCount ?? 0}
            currentPage={page}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
