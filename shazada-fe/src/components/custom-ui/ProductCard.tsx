"use client";

import Image from "next/image";
import { ProductProps } from "@/types/product.type";
import { useCart } from "@/hooks/useCart";

interface PropTypes {
  product: ProductProps;
  isDisplayCart?: boolean;
  handleOpenModal?: (selectedId: string) => void;
}

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);

const ProductCard = ({
  product,
  isDisplayCart,
  handleOpenModal,
}: PropTypes) => {
  const { addToCart, removeFromCart, cart } = useCart();
  const isInCart = cart.some((item) => item.id === product.id);
  const outOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => handleOpenModal?.(product?.id)}
      className="group h-full cursor-pointer"
    >
      <div className="relative flex flex-col h-full bg-card text-card-foreground border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-sm">
        {isDisplayCart && !outOfStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              isInCart ? removeFromCart(product.id) : addToCart(product);
            }}
            className={`
              absolute right-2 top-2 z-20
              px-2.5 py-1
              rounded-full border text-[11px] sm:text-xs font-semibold font-mono
              transition-all duration-200 active:scale-95
              ${
                isInCart
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/80 backdrop-blur-sm text-foreground border-border hover:border-primary"
              }
            `}
          >
            {isInCart ? "✓ Remove" : "+ Cart"}
          </button>
        )}

        <div className="relative w-full aspect-square bg-muted overflow-hidden">
          <Image
            src={product.image_url ?? "/images/default-img.png"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            alt={product.title ?? "product image"}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {outOfStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
              <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-3 sm:p-4 gap-1.5">
          <span className="text-[11px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide truncate">
            {product.category_title ?? "Kategori Umum"}
          </span>

          <h3 className="text-sm sm:text-[15px] font-semibold line-clamp-2 leading-snug tracking-tight">
            {product.title}
          </h3>

          <div className="mt-auto pt-2 flex items-end justify-between gap-2">
            <p className="text-base sm:text-lg font-bold text-primary leading-none">
              {formatRupiah(product.price)}
            </p>
            <p className="text-[11px] hidden sm:block sm:text-xs text-muted-foreground whitespace-nowrap">
              Stok:{" "}
              <span
                className={`font-semibold ${product.stock <= 3 ? "text-destructive" : "text-foreground"}`}
              >
                {product.stock}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
