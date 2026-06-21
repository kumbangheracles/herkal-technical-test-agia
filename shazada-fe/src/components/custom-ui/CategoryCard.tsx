"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CategoryProps } from "@/types/category.type";

type PropTypes = CategoryProps & {
  index?: number;
};

const CardIcon = ({ title, id, icon_url }: PropTypes) => {
  const router = useRouter();

  const slugify = (text: string) => {
    return text
      .toLowerCase() // huruf kecil
      .trim() // hapus spasi depan/belakang
      .replace(/[^a-z0-9\s-]/g, "") // hapus karakter aneh
      .replace(/\s+/g, "-") // spasi → -
      .replace(/-+/g, "-"); // -- → -
  };

  const goToCategory = (categoryName: string, categoryId: string) => {
    const slug = slugify(categoryName);
    router.push(`/category/${slug}/${categoryId}`);
  };

  return (
    <div
      onClick={() => goToCategory(title, id)}
      className="relative w-full h-[100px] sm:h-[140px] border-border border-2 rounded-xl overflow-hidden cursor-pointer group transition-colors hover:border-primary"
    >
      <Image
        src={icon_url ?? "/images/default-img.png"}
        width={400}
        height={400}
        alt={title || "Category Icon"}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 h-full flex items-end p-3 sm:p-4">
        <h3 className="text-white text-sm sm:text-base font-semibold leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default CardIcon;
