"use client";
import DetailItem from "@/components/DetailItem";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { capitalizeFirstLetter } from "@/helpers/capitalize";
import { formatDate } from "@/helpers/format";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { initialProductValue, ProductProps } from "@/types/product.type";
import {
  ModalProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/hooks/useProducts";
import { ProductSchema, TProduct } from "./ProductValidation";
import { AppCategorySelect } from "@/components/custom-ui/AppCategorySelect";
import { CategoryProps } from "@/types/category.type";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export interface PropTypes {
  open?: boolean;
  selectedId?: string;
  dataProduct: ProductProps;
  modalType: ModalProducts;
  formData?: ProductProps;
  dataCategories?: CategoryProps[];
  setFormData?: Dispatch<SetStateAction<ProductProps>>;
  isDisplayCart?: boolean;
  onCloseModal?: () => void;
}

const ProductModal = ({
  onCloseModal,
  open,
  selectedId,
  dataProduct,
  modalType,
  dataCategories,
  formData = initialProductValue,
  isDisplayCart = false,
  setFormData,
}: PropTypes) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TProduct, string[]>>
  >({});
  const { addToCart, cart, removeFromCart } = useCart();

  const isInCart = cart.some((item) => item.id === dataProduct?.id);
  const {
    mutate: mutatePostProduct,
    isPending: isPendingMutatePostProduct,
    error: errorMutatePostProduct,
    isSuccess: isSuccessPostProduct,
  } = useCreateProduct();

  const {
    mutate: mutatePatchProduct,
    isPending: isPendingMutatePatchProduct,
    error: isErrorMutatePatchProduct,
    isSuccess: isSuccessMutatePatchProduct,
  } = useUpdateProduct();

  const {
    mutate: mutateDeleteProd,
    isPending: isPendingDelete,
    isSuccess: isSuccessDelete,
    error: isErrorDelete,
  } = useDeleteProduct();

  function handleImageChange(file: File | null) {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }
  function buildProductFormData(
    data: ProductProps,
    file: File | null,
  ): FormData {
    const fd = new FormData();

    fd.append("title", data.title);
    fd.append("description", data.description ?? "");
    fd.append("category_id", data.category_id ?? "");
    fd.append("price", data?.price.toString() ?? 0);
    fd.append("stock", data?.stock.toString() ?? 0);

    if (file) {
      fd.append("image_file", file);
    }

    return fd;
  }

  function handleSubmit(modalType: ModalProducts) {
    if (modalType === "create") {
      const result = ProductSchema.safeParse(formData);

      if (!result.success) {
        console.log(result.error.flatten().fieldErrors);
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      const fd = buildProductFormData(formData, selectedFile);
      mutatePostProduct(fd);
    }

    if (modalType === "update") {
      if (!selectedId) {
        toast.error("Invalid id, pls try again later.");
        return;
      }

      const result = ProductSchema.safeParse(dataProduct);

      if (!result.success) {
        console.log(result.error.flatten().fieldErrors);
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      const fd = buildProductFormData(formData, selectedFile);

      console.log("FD: ", fd);
      mutatePatchProduct({
        id: selectedId ?? "",
        formData: fd,
      });
    }

    if (modalType === "delete") {
      if (!selectedId) {
        toast.error("Invalid id, pls try again later.");
        return;
      }
      mutateDeleteProd(selectedId);
    }
  }
  useEffect(() => {
    if (modalType === "update" && dataProduct) {
      setFormData?.(dataProduct);
    }

    if (modalType === "create") {
      setFormData?.(initialProductValue);
    }

    if (modalType === "detail" || modalType === "delete") {
      setFormData?.(initialProductValue);
    }
  }, [modalType, dataProduct]);
  useEffect(() => {
    if (
      isSuccessPostProduct ||
      isSuccessMutatePatchProduct ||
      isSuccessDelete
    ) {
      // toast.success("Success create product.");
      onCloseModal?.();
    }

    if (errorMutatePostProduct) {
      toast.error("Failed create product.");
    }
    if (isErrorMutatePatchProduct) {
      toast.error("Failed update product");
    }
    if (isErrorDelete) {
      toast.error("Failed delete product.");
    }
  }, [
    errorMutatePostProduct,
    isErrorMutatePatchProduct,
    isSuccessPostProduct,
    isSuccessMutatePatchProduct,
    isSuccessDelete,
    isErrorDelete,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({});
    }, 3000);

    return () => clearTimeout(timer);
  }, [errors]);

  return (
    <Dialog key={selectedId} open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="flex items-center relative justify-center flex-col">
          <DialogTitle>{capitalizeFirstLetter(modalType)} Product </DialogTitle>
          {modalType === "detail" && (
            <DialogDescription className="sm:text-sm text-[12px]">
              List detail product dengan nama {dataProduct?.title}
            </DialogDescription>
          )}
        </DialogHeader>
        <>
          {/* Detail ============ */}
          {modalType === "detail" && (
            <div className="-mt-3 max-h-[450px] custom-scrollbar overflow-y-auto">
              <div className="relative mx-auto mb-3 border-border border w-35 h-35 sm:h-52 sm:w-52 overflow-hidden rounded-2xl">
                <Image
                  src={dataProduct?.image_url ?? "/images/default-img.png"}
                  alt={dataProduct?.title ?? "default-img"}
                  fill
                  className="object-cover"
                />
              </div>
              <DetailItem
                label={"Product Name"}
                value={dataProduct?.title ?? ""}
              />

              <DetailItem
                label={"Category"}
                value={dataProduct?.category_title ?? ""}
              />
              <DetailItem
                label={"Price"}
                value={"Rp" + dataProduct?.price?.toLocaleString("id-ID")}
              />
              <DetailItem label={"Stock"} value={dataProduct?.stock ?? 0} />

              <DetailItem
                label={"Created At"}
                value={formatDate(dataProduct?.created_at)}
              />
              <DetailItem
                label={"Updated At"}
                value={formatDate(dataProduct?.updated_at)}
              />
              <div className="mt-2">
                <p className="text-foreground text-sm font-semibold">
                  Description:
                </p>
                <div className="p-3 mt-2 rounded-xl text-[12px] bg-muted break-words whitespace-pre-wrap">
                  {dataProduct?.description ?? ""}
                </div>
              </div>
            </div>
          )}
          {/* Create & Update ============ */}
          {(modalType === "create" || modalType === "update") && (
            <div className="-mt-3 flex items-start flex-col gap-3 max-h-[450px] custom-scrollbar overflow-y-auto">
              <ImageUpload
                onChange={handleImageChange}
                value={dataProduct?.image_url}
                placeholder="Upload product image"
              />
              <div className="flex flex-col text-foreground/50 gap-2 w-full">
                <Label className="px-3">Product name</Label>
                <Input
                  className="sm:text-sm text-[12px] text-foreground"
                  onChange={(e) =>
                    setFormData?.({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  defaultValue={dataProduct?.title ?? ""}
                  type="text"
                  placeholder="Input product name . . ."
                />
                {errors?.title && (
                  <p className="text-sm text-start text-red-500 px-3 text-[12px] font-semibold font-mono">
                    {errors?.title?.[0]}
                  </p>
                )}
              </div>
              <div className="flex flex-col text-foreground/50 gap-2 w-full">
                <Label className="px-3">Category</Label>
                <AppCategorySelect
                  categories={dataCategories ?? []}
                  value={formData?.category_id}
                  onChange={(categoryId) =>
                    setFormData?.({ ...formData, category_id: categoryId })
                  }
                  // placeholder="Pilih kategori produk"
                />
                {errors?.category_id && (
                  <p className="text-sm text-start text-red-500 px-3 text-[12px] font-semibold font-mono">
                    {errors.category_id?.[0]}
                  </p>
                )}
              </div>
              <div className="flex flex-col text-foreground/50 gap-2 w-full">
                <Label className="px-3">Price</Label>
                <Input
                  onChange={(e) =>
                    setFormData?.({
                      ...formData,
                      price: Number(e.target.value),
                    })
                  }
                  className="sm:text-sm text-[12px] text-foreground"
                  defaultValue={dataProduct?.price ?? 0}
                  type="number"
                  placeholder="Input price . . ."
                />
                {errors?.title && (
                  <p className="text-sm text-start text-red-500 px-3 text-[12px] font-semibold font-mono">
                    {errors?.price?.[0]}
                  </p>
                )}
              </div>
              <div className="flex flex-col text-foreground/50 gap-2 w-full">
                <Label className="px-3">Stock</Label>
                <Input
                  onChange={(e) =>
                    setFormData?.({
                      ...formData,
                      stock: Number(e.target.value),
                    })
                  }
                  className="sm:text-sm text-[12px] text-foreground"
                  defaultValue={dataProduct?.stock ?? 0}
                  type="number"
                  placeholder="Input stock . . ."
                />
                {errors?.title && (
                  <p className="text-sm text-start text-red-500 px-3 text-[12px] font-semibold font-mono">
                    {errors?.stock?.[0]}
                  </p>
                )}
              </div>
              <div className="flex flex-col text-foreground/50 gap-2 w-full">
                <Label className="px-3">Description</Label>
                <Textarea
                  onChange={(e) =>
                    setFormData?.({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="sm:text-sm text-[12px] text-foreground"
                  defaultValue={(dataProduct?.description as string) ?? ""}
                  // type="text"
                  placeholder="Input description . . ."
                />
                {errors?.title && (
                  <p className="text-sm text-start text-red-500 px-3 text-[12px] font-semibold font-mono">
                    {errors?.description?.[0]}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
        {/* Delete ============ */}
        {modalType === "delete" && (
          <div className="-mt-3">
            <DialogDescription>
              Are you sure wan't to delete product <b>{dataProduct?.title}</b>?
            </DialogDescription>
          </div>
        )}
        <DialogFooter>
          <Button
            variant={
              modalType === "detail" || modalType === "delete"
                ? "secondary"
                : "destructive"
            }
            onClick={() => onCloseModal?.()}
          >
            {isPendingDelete ||
            isPendingMutatePostProduct ||
            isPendingMutatePatchProduct ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Close"
            )}
          </Button>
          {(modalType === "create" || modalType === "update") && (
            <Button
              variant={"secondary"}
              onClick={() => handleSubmit(modalType)}
            >
              {isPendingMutatePostProduct || isPendingMutatePatchProduct ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          )}
          {modalType === "delete" && (
            <Button
              variant={"destructive"}
              onClick={() => handleSubmit(modalType)}
            >
              {isPendingDelete ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          )}

          {modalType === "detail" && isDisplayCart && (
            <>
              <Button
                onClick={(e) => {
                  if (dataProduct?.stock === 0) {
                    toast.info("Tidak bisa add to cart stock habis.");
                    return;
                  }

                  e.stopPropagation();
                  isInCart
                    ? removeFromCart(dataProduct.id)
                    : addToCart(dataProduct);
                }}
                variant={isInCart ? "destructive" : "outline"}
              >
                {isInCart ? "✓ Remove" : "+ Add Cart"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
