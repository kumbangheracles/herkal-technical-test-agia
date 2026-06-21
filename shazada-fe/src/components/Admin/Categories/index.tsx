"use client";
import AdminLayout from "@/components/custom-ui/AppAdminLayout";
import { AppTable } from "@/components/custom-ui/AppTable";
import { Button } from "@/components/ui/button";
import { ModalCategories, useCategories } from "@/hooks/useCategories";
import { useMounted } from "@/hooks/useMounted";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CategoryModal from "./CategoryModal";
import { CategoryProps, initialCategoryValue } from "@/types/category.type";

const AdminCategoriesIndex = () => {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const sortOrder = (searchParams.get("sort_order") ?? "newest") as
    | "newest"
    | "oldest";
  const limit = Number(searchParams.get("limit") ?? "10");
  const [modalType, setModalTypes] = useState<ModalCategories | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<CategoryProps | null>(null);
  const { query, getCategoryColumns } = useCategories(
    page,
    limit,
    search,

    sortOrder,
  );
  const { data: dataCategories, error: errorCategories, isLoading } = query;
  const [formData, setFormData] = useState<CategoryProps>(initialCategoryValue);

  useEffect(() => {
    if (selectedId === null) return;

    const selectedCategory = dataCategories?.data?.find(
      (item) => item.id === selectedId,
    );

    setSelectedData(selectedCategory as CategoryProps);
  }, [selectedId]);

  useEffect(() => {
    if (!errorCategories) return;
    toast.error("Something went wrong.");
    console.error(errorCategories);
  }, [errorCategories]);

  const handleOpenModal = (
    type: ModalCategories | null,
    idCat?: string | null,
  ) => {
    setModalTypes(type);
    setSelectedId(idCat as string);
  };

  const handleCloseModal = () => {
    setModalTypes(null);
    setSelectedId(null);
    setSelectedData(null);
  };

  const categoryColumns = getCategoryColumns({
    onDetail: (row) => handleOpenModal("detail", row.id),
    onUpdate: (row) => handleOpenModal("update", row.id),
    onDelete: (row) => {
      handleOpenModal("delete", row.id);
    },
  });
  if (!mounted)
    return (
      <AdminLayout>
        <div className="flex items-center min-h-screen w-full justify-center">
          <Loader2 className="animate-spin" size={50} />
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="sm:p-4 p-0">
        <div className="bg-card/50 backdrop-blur-2xl p-5 rounded-2xl">
          <AppTable
            isLoading={isLoading}
            data={dataCategories?.data as CategoryProps[]}
            columns={categoryColumns}
            filters={[
              {
                key: "sort_order",
                label: "All",
                placeholder: "All",
                options: [
                  { label: "Terbaru", value: "newest" },
                  { label: "Terlama", value: "oldest" },
                ],
              },
            ]}
            searchPlaceholder="Cari kategori by name ..."
            totalPages={dataCategories?.totalPages ?? 1}
            totalData={dataCategories?.totalCount ?? 0}
            currentPage={page}
            buttonAdd={
              <Button
                className="text-[12px] sm:text-sm"
                onClick={() => handleOpenModal("create")}
              >
                + New Category
              </Button>
            }
          />
        </div>

        <CategoryModal
          dataCategory={selectedData as CategoryProps}
          onCloseModal={handleCloseModal}
          selectedId={selectedId as string}
          open={modalType !== null}
          formData={formData}
          setFormData={setFormData}
          modalType={modalType as ModalCategories}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesIndex;
