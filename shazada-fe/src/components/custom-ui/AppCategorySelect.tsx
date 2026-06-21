// src/components/CategorySelect.tsx
"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CategoryOption {
  id: string;
  title: string;
}

interface CategorySelectProps {
  categories: CategoryOption[];
  value: string;
  onChange: (categoryId: string) => void;
  placeholder?: string;
  isAllCategory?: boolean;
}

export function AppCategorySelect({
  categories,
  value,
  onChange,
  isAllCategory = false,
  placeholder = "Pilih kategori...",
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    categories.find((c) => c.id === value)?.title ?? placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="sm:text-sm text-[12px] w-full justify-between"
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full p-0 z-[99999999999999999]"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Cari kategori..." />
          <CommandList>
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            {isAllCategory ? (
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    onChange("all");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "all" || value === ""
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  Semua Kategori
                </CommandItem>

                {categories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.title}
                    onSelect={() => {
                      onChange(cat.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cat.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {cat.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandGroup>
                {categories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.title}
                    onSelect={() => {
                      onChange(cat.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cat.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {cat.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
