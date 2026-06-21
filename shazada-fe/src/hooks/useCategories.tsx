"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/categories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import { ColumnDef, ColumnHandlers } from "@/components/custom-ui/AppTable";
import { formatDate } from "@/helpers/format";
import Image from "next/image";
import { CategoryProps } from "@/types/category.type";
import { toast } from "sonner";

export type ModalCategories = "create" | "update" | "delete" | "detail";

export function useCategories(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortOrder: "newest" | "oldest" = "newest",
) {
  const getCategoryColumns = ({
    onDetail,
    onUpdate,
    onDelete,
  }: ColumnHandlers<CategoryProps> = {}): ColumnDef<CategoryProps>[] => [
    {
      key: "icon_url",
      label: "Icon",
      hideOnMobile: true,
      render: (row) => (
        <div className="rounded-md w-15 h-15 bg-foreground/50 overflow-hidden">
          <Image
            alt={row?.title}
            width={100}
            height={100}
            className="w-full h-full object-cover"
            src={row?.icon_url ?? "/images/default-img.png"}
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Category name",
    },
    {
      key: "description",
      label: "Description",
      hideOnMobile: true,
      render: (row) => (
        <span className="truncate max-w-[100px]">{row?.description}</span>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      hideOnMobile: true,
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "updated_at",
      label: "Update At",
      hideOnMobile: true,
      render: (row) => formatDate(row.updated_at),
    },
    {
      key: "action",
      label: "Action",
      hideOnMobile: false,
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
              <span className="sr-only">Buka menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDetail?.(row)}>
              <Eye className="mr-2 size-4" />
              Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdate?.(row)}>
              <Pencil className="mr-2 size-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(row)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const query = useQuery({
    queryKey: ["categories", page, pageSize, search, sortOrder],
    queryFn: () => getCategoriesAction(page, pageSize, search, sortOrder),
  });

  return { query, getCategoryColumns };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createCategoryAction(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Success create category.");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateCategoryAction(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Success update category.");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoryAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Success delete category.");
    },
  });
}
