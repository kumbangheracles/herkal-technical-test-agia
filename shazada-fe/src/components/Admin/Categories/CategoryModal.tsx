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
import {
  ModalCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import { CategoryProps, initialCategoryValue } from "@/types/category.type";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { CategorySchema, TCategory } from "./CategoryValidation";

export interface PropTypes {
  open?: boolean;
  selectedId?: string;
  dataCategory: CategoryProps;
  modalType: ModalCategories;
  formData?: CategoryProps;
  setFormData?: Dispatch<SetStateAction<CategoryProps>>;
  onCloseModal?: () => void;
}

const CategoryModal = ({
  onCloseModal,
  open,
  selectedId,
  dataCategory,
  modalType,
  formData = initialCategoryValue,
  setFormData,
}: PropTypes) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TCategory, string[]>>
  >({});
  const {
    mutate: mutatePostCategory,
    isPending: isPendingMutatePostCategory,
    error: errorMutatePostCategory,
    isSuccess: isSuccessPostCategory,
  } = useCreateCategory();

  const {
    mutate: mutatePatchCategory,
    isPending: isPendingMutatePatchCategory,
    error: isErrorMutatePatchCategory,
    isSuccess: isSuccessMutatePatchCategory,
  } = useUpdateCategory();

  const {
    mutate: mutateDeleteCat,
    isPending: isPendingDelete,
    isSuccess: isSuccessDelete,
    error: isErrorDelete,
  } = useDeleteCategory();

  function handleImageChange(file: File | null) {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }
  function buildCategoryFormData(
    data: CategoryProps,
    file: File | null,
  ): FormData {
    const fd = new FormData();

    fd.append("title", data.title);
    fd.append("description", data.description ?? "");

    if (file) {
      fd.append("icon_file", file);
    }

    return fd;
  }

  function handleSubmit(modalType: ModalCategories) {
    if (modalType === "create") {
      const result = CategorySchema.safeParse(formData);

      if (!result.success) {
        console.log(result.error.flatten().fieldErrors);
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      const fd = buildCategoryFormData(formData, selectedFile);
      mutatePostCategory(fd);
    }

    if (modalType === "update") {
      if (!selectedId) {
        toast.error("Invalid id, pls try again later.");
        return;
      }

      const result = CategorySchema.safeParse(formData);

      if (!result.success) {
        console.log(result.error.flatten().fieldErrors);
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      const fd = buildCategoryFormData(formData, selectedFile);
      mutatePatchCategory({
        id: selectedId ?? "",
        formData: fd,
      });
    }

    if (modalType === "delete") {
      if (!selectedId) {
        toast.error("Invalid id, pls try again later.");
        return;
      }
      mutateDeleteCat(selectedId, {
        onSuccess: (result) => {
          if (result?.error) {
            toast.error(result.error);
          }
        },
      });
    }
  }
  useEffect(() => {
    if (modalType === "update" && dataCategory) {
      setFormData?.(dataCategory);
    }

    if (modalType === "create") {
      setFormData?.(initialCategoryValue);
    }

    if (modalType === "detail" || modalType === "delete") {
      setFormData?.(initialCategoryValue);
    }
  }, [modalType, dataCategory]);
  useEffect(() => {
    if (
      isSuccessPostCategory ||
      isSuccessDelete ||
      isSuccessMutatePatchCategory
    ) {
      onCloseModal?.();
    }

    if (errorMutatePostCategory) {
      toast.error(errorMutatePostCategory as unknown as string);
      console.error(errorMutatePostCategory);
    }
    if (isErrorMutatePatchCategory) {
      toast.error(isErrorMutatePatchCategory as unknown as string);
      console.error(isErrorMutatePatchCategory);
    }
    if (isErrorDelete) {
      toast.error(isErrorDelete as unknown as string);
      console.error(isErrorDelete);
    }
  }, [
    errorMutatePostCategory,
    isErrorMutatePatchCategory,
    isSuccessPostCategory,
    isSuccessMutatePatchCategory,
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
        <DialogHeader className="flex items-center justify-center flex-col">
          <DialogTitle>
            {capitalizeFirstLetter(modalType)} Category{" "}
          </DialogTitle>
          {modalType === "detail" && (
            <DialogDescription className="sm:text-sm text-[12px]">
              List detail category dengan nama {dataCategory?.title}
            </DialogDescription>
          )}
        </DialogHeader>
        <>
          {/* Detail ============ */}
          {modalType === "detail" && (
            <div className="-mt-3">
              <div className="relative mx-auto mb-3 border-border border w-35 h-35 sm:h-52 sm:w-52 overflow-hidden rounded-2xl">
                <Image
                  src={dataCategory?.icon_url ?? "/images/default-img.png"}
                  alt={dataCategory?.title}
                  fill
                  className="object-cover"
                />
              </div>
              <DetailItem
                label={"Category Name"}
                value={dataCategory?.title ?? ""}
              />

              <DetailItem
                label={"Created At"}
                value={formatDate(dataCategory?.created_at)}
              />
              <DetailItem
                label={"Updated At"}
                value={formatDate(dataCategory?.updated_at)}
              />
              <div className="mt-2 max-w-full w-full">
                <p className="text-foreground text-sm font-semibold">
                  Description:
                </p>
                <div className="p-3 mt-2 rounded-xl text-[12px] bg-muted break-all min-w-0 w-full overflow-hidden">
                  {dataCategory?.description ?? ""}
                </div>
              </div>
            </div>
          )}
          {/* Create & Update ============ */}
          {(modalType === "create" || modalType === "update") && (
            <div className="-mt-3 flex items-start flex-col gap-3">
              <ImageUpload
                onChange={handleImageChange}
                value={dataCategory?.icon_url}
                placeholder="Upload category icon"
              />
              <Input
                className="sm:text-sm text-[12px]"
                onChange={(e) =>
                  setFormData?.({
                    ...formData,
                    title: e.target.value,
                  })
                }
                defaultValue={dataCategory?.title ?? ""}
                type="text"
                placeholder="Input category name . . ."
              />
              {errors?.title && (
                <p className="text-sm text-start text-red-500 px-3 text-[12px] font-semibold font-mono">
                  {errors?.title?.[0]}
                </p>
              )}
              <Input
                onChange={(e) =>
                  setFormData?.({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="sm:text-sm text-[12px]"
                defaultValue={(dataCategory?.description as string) ?? ""}
                type="text"
                placeholder="Input description . . ."
              />
              {errors?.title && (
                <p className="text-sm text-start text-red-500 px-3 text-[12px] font-semibold font-mono">
                  {errors?.description?.[0]}
                </p>
              )}
            </div>
          )}
        </>
        {/* Delete ============ */}
        {modalType === "delete" && (
          <div className="-mt-3">
            <DialogDescription>
              Are you sure wan't to delete category <b>{dataCategory?.title}</b>
              ?
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
            isPendingMutatePatchCategory ||
            isPendingMutatePostCategory ? (
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
              {isPendingMutatePostCategory || isPendingMutatePatchCategory ? (
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
