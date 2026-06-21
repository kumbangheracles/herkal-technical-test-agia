"use client";
import AdminLayout from "@/components/custom-ui/AppAdminLayout";
import { AppTable, FilterOption } from "@/components/custom-ui/AppTable";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useMounted } from "@/hooks/useMounted";
import { ModalProducts, useProducts } from "@/hooks/useProducts";
import { initialProductValue, ProductProps } from "@/types/product.type";
import { CalendarFold, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductModal from "./ProductModal";

const AdminProductIndex = () => {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const sortOrder = (searchParams.get("sort_order") ?? "newest") as
    | "newest"
    | "oldest";
  const categoryId = searchParams.get("category_id") ?? "";
  const limit = Number(searchParams.get("limit") ?? "10");
  const [modalType, setModalTypes] = useState<ModalProducts | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<ProductProps | null>(null);
  const { getProductColumns, query } = useProducts(
    page,
    limit,
    search,
    sortOrder,
    categoryId,
  );
  const { query: queryCat } = useCategories();
  const { data: dataProducts, error: errorProducts, isLoading } = query;
  const { data: dataCat } = queryCat;
  const [formData, setFormData] = useState<ProductProps>(initialProductValue);

  const listCat = dataCat?.data?.map((item) => ({
    label: item?.title,
    value: item?.id,
  }));
  const categoryMap = new Map(
    dataCat?.data?.map((cat) => [cat.id, cat.title]) ?? [],
  );

  const productsWithCategory = dataProducts?.data?.map((product) => ({
    ...product,
    category_title: categoryMap.get(product.category_id) ?? "Tanpa Kategori",
  }));

  useEffect(() => {
    if (selectedId === null) return;

    const selectedCategory = productsWithCategory?.find(
      (item) => item.id === selectedId,
    );

    setSelectedData(selectedCategory as ProductProps);
  }, [selectedId]);

  useEffect(() => {
    if (!errorProducts) return;
    toast.error("Something went wrong.");
    console.error(errorProducts);
  }, [errorProducts]);

  const handleOpenModal = (
    type: ModalProducts | null,
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

  const productColumns = getProductColumns({
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
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* <AppSearchInput /> */}
        </div>

        <div className="bg-card/50 backdrop-blur-2xl p-5 rounded-2xl">
          <AppTable
            isLoading={isLoading}
            data={productsWithCategory as ProductProps[]}
            columns={productColumns}
            containerFilterClassName="flex-wrap"
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
              {
                key: "category_id",
                label: "All",
                placeholder: "All",
                searchable: true,
                options: listCat as FilterOption[],
              },
            ]}
            searchPlaceholder="Cari product by title ..."
            totalPages={dataProducts?.totalPages ?? 1}
            totalData={dataProducts?.totalCount ?? 0}
            currentPage={page}
            buttonAdd={
              <Button
                className="text-[12px] sm:text-sm"
                onClick={() => handleOpenModal("create")}
              >
                + New Product
              </Button>
            }
          />
        </div>
      </div>
      <ProductModal
        dataProduct={selectedData as ProductProps}
        modalType={modalType as ModalProducts}
        onCloseModal={handleCloseModal}
        selectedId={selectedId as string}
        open={modalType !== null}
        formData={formData}
        setFormData={setFormData}
        dataCategories={dataCat?.data}
      />
    </AdminLayout>
  );
};

export default AdminProductIndex;
