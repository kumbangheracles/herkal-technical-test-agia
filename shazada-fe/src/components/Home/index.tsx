"use client";

import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AppSearchInput from "../AppInputSearch";
import { AppCategorySelect } from "../custom-ui/AppCategorySelect";
import AppGuestLayout from "../custom-ui/AppGuestLayout";
import { AppSelectFilter } from "../custom-ui/AppSelectFilter";
import { FilterDef } from "../custom-ui/AppTable";
import EcommerceBgPattern from "../custom-ui/EcommerceBgPattern";

import ProductCard from "../custom-ui/ProductCard";
import ProductCardSkeleton from "../custom-ui/ProductCardSkeleton";
import { useCallback, useEffect, useState } from "react";
import ProductModal from "../Admin/Products/ProductModal";
import { ProductProps } from "@/types/product.type";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Button } from "../ui/button";
import { Info, ArrowRight, Tag, Truck } from "lucide-react";
import CardCategory from "../custom-ui/CardCategory";
const filters: FilterDef[] = [
  {
    key: "sort_order",
    label: "All",
    placeholder: "All",
    className: "w-full sm:w-[50px]",
    options: [
      { label: "Terbaru", value: "newest" },
      { label: "Terlama", value: "oldest" },
    ],
  },
];

const HomeIndex = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDataProd, setSelectedDataProd] = useState<ProductProps | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = searchParams.get("search") ?? undefined;
  const sortOrder =
    (searchParams.get("sort") as "newest" | "oldest" | null) ?? "newest";
  const categoryId = searchParams.get("category") || undefined;
  const handleOpenModal = (selectedId: string) => {
    setSelectedId(selectedId);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setIsOpen(false);
    setSelectedDataProd(null);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const { query: queryProduct } = useProducts(
    page,
    pageSize,
    search,
    sortOrder,
    categoryId,
  );
  const { query: queryCat } = useCategories();
  const { data: dataCategories, isPending: isPendingCat } = queryCat;
  const { data: dataProduct, isPending: isPendingProd } = queryProduct;
  const currentCategory = searchParams.get("category") ?? "";

  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") ?? "",
  );

  const updateSearchParam = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );
  useEffect(() => {
    const dataProd = dataProduct?.data?.find((item) => item.id === selectedId);

    setSelectedDataProd(dataProd as ProductProps);
  }, [selectedId]);

  useEffect(() => {
    const handler = setTimeout(() => updateSearchParam(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearchClear = () => {
    setSearchTerm("");
    updateSearchParam("");
  };
  if (isPendingCat || isPendingProd)
    return (
      <AppGuestLayout>
        <div className="min-h-screen relative w-full flex-col gap-4 flex items-center justify-center">
          <div className="absolute inset-0  -z-10 w-full h-full pointer-events-none select-none text-foreground">
            <EcommerceBgPattern />
          </div>
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="relative w-full h-[100px] sm:h-[140px] border-border border-2 rounded-xl overflow-hidden bg-muted animate-pulse flex items-end p-3 sm:p-4"
                >
                  <div className="h-4 w-2/3 bg-background/50 rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </AppGuestLayout>
    );

  return (
    <AppGuestLayout>
      <section id="explore" className="min-h-screen w-full flex ">
        <div className="absolute inset-0  -z-10 w-full h-full pointer-events-none select-none text-foreground">
          <EcommerceBgPattern />
        </div>
        <div className="flex flex-col gap-2 p-4 w-full">
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start lg:items-center pb-2">
            <div className="flex flex-col gap-3 lg:max-w-sm xl:max-w-md shrink-0">
              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                Selamat datang di SHAZADA
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold leading-snug tracking-tight">
                Belanja lebih mudah,{" "}
                <span className="text-muted-foreground">
                  hidup lebih praktis.
                </span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Temukan ribuan produk pilihan dari berbagai kategori — semua
                dalam satu tempat.
              </p>
              <div className="flex gap-2 flex-wrap mt-1">
                <button
                  onClick={() =>
                    document
                      .getElementById("explore")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-5 py-2 rounded-full bg-foreground text-background text-xs font-semibold transition-colors hover:bg-foreground/80"
                >
                  Mulai belanja
                </button>
                <button className="px-5 py-2 rounded-full border border-border text-xs font-semibold transition-colors hover:bg-muted">
                  Lihat promo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
              <div className="relative flex flex-col justify-between gap-3 p-4 sm:p-5 rounded-2xl border border-border bg-card overflow-hidden min-h-[130px] sm:min-h-[150px]">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    Promo hari ini
                  </p>
                  <p className="text-base sm:text-lg font-semibold leading-snug">
                    Diskon hingga 50%
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
                    Produk pilihan fashion & elektronik
                  </p>
                </div>
                <span className="text-[11px] font-medium text-foreground/70">
                  Klaim sekarang →
                </span>
                <div className="absolute -right-3 -bottom-3 text-foreground/5 pointer-events-none select-none">
                  <Tag size={72} />
                </div>
              </div>

              <div className="relative flex flex-col justify-between gap-3 p-4 sm:p-5 rounded-2xl border border-border bg-muted/50 overflow-hidden min-h-[130px] sm:min-h-[150px]">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    Pengiriman gratis
                  </p>
                  <p className="text-base sm:text-lg font-semibold leading-snug">
                    Ke seluruh Indonesia
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
                    Minimal pembelian Rp 100.000
                  </p>
                </div>
                <span className="text-[11px] font-medium text-foreground/70">
                  Cek syarat →
                </span>
                <div className="absolute -right-3 -bottom-3 text-foreground/5 pointer-events-none select-none">
                  <Truck size={72} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 justify-center items-center mx-auto xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {dataCategories?.data?.map((item) => (
              <CardCategory
                key={item.id}
                {...item}
                // onClick={(id) => handleFilterCategory(id)}
                // isActive={selectedCategory === item.id}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full max-w-1/2">
            <div className="bg-muted w-48! rounded-3xl">
              <AppCategorySelect
                isAllCategory={true}
                categories={dataCategories?.data ?? []}
                value={currentCategory ?? "all"}
                onChange={(categoryId: string) =>
                  handleFilterChange("category", categoryId || "all")
                }
              />
            </div>

            <AppSearchInput
              classContainer="bg-muted! rounded-3xl"
              className="w-43"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              clearable
              onClear={handleSearchClear}
              placeholder="Cari produk..."
            />

            {/* <div className="flex gap-2 bg-muted w-full rounded-3xl">
              {filters.map((filter) => (
                <AppSelectFilter
                  key={filter.key}
                  filter={filter}
                  onFilterChange={handleFilterChange}
                />
              ))}
            </div> */}
          </div>

          <div className="w-full max-w-full sm:max-w-7xl mx-auto py-4">
            <h4 className="font-semibold text-2xl font-mono pb-4 px-3">
              List Products
            </h4>
            {dataProduct?.data?.length === 0 && (
              <div className="flex items-center w-full justify-center p-2 sm:p-7">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Info />
                    </EmptyMedia>
                    <EmptyTitle>No Product Availble</EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button onClick={() => router.push("/")}>
                      Go Back <ArrowRight />
                    </Button>
                  </EmptyContent>
                </Empty>
              </div>
            )}
            {dataProduct?.data?.length !== 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                <>
                  {dataProduct?.data?.map((product) => (
                    <ProductCard
                      product={product}
                      key={product.id}
                      handleOpenModal={handleOpenModal}
                    />
                  ))}
                </>
              </div>
            )}
          </div>
        </div>
      </section>

      <ProductModal
        isDisplayCart={true}
        dataProduct={selectedDataProd as ProductProps}
        onCloseModal={handleCloseModal}
        open={isOpen}
        modalType={"detail"}
      />
    </AppGuestLayout>
  );
};

export default HomeIndex;
