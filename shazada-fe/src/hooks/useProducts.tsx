"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductAction,
  deleteProductAction,
  getProductsAction,
  updateProductAction,
} from "@/app/actions/products";
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
import { ProductProps } from "@/types/product.type";
import Image from "next/image";
import { toast } from "sonner";

export type ModalProducts = "create" | "update" | "delete" | "detail";

export function useProducts(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortOrder: "newest" | "oldest" = "newest",
  categoryId?: string,
) {
  const getProductColumns = ({
    onDetail,
    onUpdate,
    onDelete,
  }: ColumnHandlers<ProductProps> = {}): ColumnDef<ProductProps>[] => [
    {
      key: "image_url",
      label: "Image",
      hideOnMobile: true,
      render: (row) => (
        <div className="rounded-md w-15 h-15 bg-foreground/50 overflow-hidden">
          <Image
            alt={row?.title}
            width={100}
            height={100}
            className="w-full h-full object-cover"
            src={row?.image_url ?? "/images/default-img.png"}
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Product Name",
    },
    {
      key: "category_title",
      label: "Category",
      hideOnMobile: true,
    },
    // {
    //   key: "description",
    //   label: "Description",
    //   hideOnMobile: true,
    //   render: (row) => (
    //     <span className="truncate max-w-[100px]">{row?.description}</span>
    //   ),
    // },
    {
      key: "price",
      label: "Price",
      hideOnMobile: true,
      render: (row) => (
        <p className="font-bold tracking-wide text-primary">
          Rp {row?.price.toLocaleString("id-ID")}
        </p>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      hideOnMobile: true,
    },
    {
      key: "created_at",
      label: "Created At",

      hideOnMobile: true,
      render: (row) => formatDate(row.created_at),
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
    queryKey: ["products", page, pageSize, search, sortOrder, categoryId],
    queryFn: () =>
      getProductsAction(page, pageSize, search, sortOrder, categoryId),
  });

  return { query, getProductColumns };
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createProductAction(formData),
    onSuccess: () => {
      toast.success("Success create product.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateProductAction(id, formData),
    onSuccess: () => {
      toast.success("Success update product.");
      console.log("onSuccess di hook useUpdateProduct terpanggil");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductAction(id),
    onSuccess: () => {
      toast.success("Success delete product.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
