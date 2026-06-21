import Image from "next/image";
import { CategoryProps } from "@/types/category.type";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";

interface CardCategoryProps extends CategoryProps {
  onClick?: (id: string) => void;
  isActive?: boolean;
}

const CardCategory = ({
  id,
  title,
  description,
  icon_url,
  onClick,
  isActive,
}: CardCategoryProps) => {
  return (
    <div
      onClick={() => onClick?.(id)}
      className={cn(
        "group flex flex-col items-start gap-2.5 p-3 sm:p-3.5",
        "bg-card border border-border rounded-2xl",
        "cursor-pointer transition-all duration-200",
        "hover:border-primary hover:bg-accent/40",
        isActive && "border-primary bg-accent/40",
      )}
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border bg-muted flex items-center justify-center shrink-0 transition-colors group-hover:border-primary/40">
        {icon_url ? (
          <div className="relative w-5 h-5 sm:w-6 sm:h-6">
            <Image src={icon_url} alt={title} fill className="object-contain" />
          </div>
        ) : (
          <Tag size={16} className="text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col gap-0.5 min-w-0 w-full">
        <p className="text-xs sm:text-[13px] font-semibold text-foreground leading-snug truncate">
          {title}
        </p>
        {description && (
          <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardCategory;
