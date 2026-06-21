"use client";

import { useCart } from "@/hooks/useCart";
import AppGuestLayout from "../custom-ui/AppGuestLayout";
import EcommerceBgPattern from "../custom-ui/EcommerceBgPattern";
import ProductCard from "../custom-ui/ProductCard";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { ArrowRight, Icon, Info } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const CollectionIndex = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  return (
    <AppGuestLayout>
      <div className="min-h-screen relative w-full flex-col gap-4 flex items-center justify-center">
        <div className="absolute inset-0  -z-10 w-full h-full pointer-events-none select-none text-foreground">
          <EcommerceBgPattern />
        </div>

        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center w-full justify-between">
            <h4 className="font-semibold text-2xl font-mono pb-4 px-3">
              My Collections
            </h4>
            {cart?.length !== 0 && (
              <Button onClick={() => clearCart()}>Clear All</Button>
            )}
          </div>

          {cart?.length === 0 && (
            <div className="flex items-center w-full justify-center p-7">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Info />
                  </EmptyMedia>
                  <EmptyTitle>No Product Availble</EmptyTitle>
                  <EmptyDescription>Let's shop first!</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => router.push("/")}>
                    Go Shop <ArrowRight />
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          )}
          {cart?.length !== 0 && (
            <div className="grid grid-cols-2 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              <>
                {cart?.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                    //   handleOpenModal={handleOpenModal}
                  />
                ))}
              </>
            </div>
          )}
        </div>
      </div>
    </AppGuestLayout>
  );
};

export default CollectionIndex;
