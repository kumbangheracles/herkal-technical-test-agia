"use client";

import { useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { FilterDef } from "./AppTable";

interface AppSelectProps {
  filter: FilterDef;
  onFilterChange: (key: string, value: string) => void;
}

export function AppSelectFilter({ filter, onFilterChange }: AppSelectProps) {
  const searchParams = useSearchParams();
  const currentValue = searchParams.get(filter?.key) ?? "all";
  const currentLabel =
    filter.options.find((opt) => opt.value === currentValue)?.label ??
    filter.placeholder ??
    filter.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={
            filter.className ??
            "sm:text-sm text-[12px] w-1/2 sm:w-40 justify-between"
          }
        >
          <span>{currentLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => onFilterChange(filter.key, "all")}>
          {currentValue === "all" && <Check className="mr-2 h-4 w-4" />}
          {filter.placeholder ?? `All ${filter.label}`}
        </DropdownMenuItem>
        {filter?.options?.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onFilterChange(filter.key, opt.value)}
          >
            {currentValue === opt.value && <Check className="mr-2 h-4 w-4" />}
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
