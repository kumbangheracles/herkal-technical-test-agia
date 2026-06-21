"use client";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full aspect-square bg-muted/40 animate-pulse" />

      <div className="flex flex-col flex-grow p-4 gap-3">
        <div className="h-3 w-1/3 bg-muted animate-pulse rounded-full" />

        <div className="space-y-2 mt-1">
          <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-4 w-4/5 bg-muted animate-pulse rounded-md" />
        </div>

        <div className="mt-auto pt-3 flex flex-col gap-2.5">
          <div className="h-6 w-1/2 bg-muted animate-pulse rounded-md" />
          <div className="h-3 w-1/4 bg-muted/60 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
