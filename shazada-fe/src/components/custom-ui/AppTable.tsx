"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Loader2,
  Check,
  ChevronDown,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { ReactNode } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "../ui/dropdown-menu";
import { SearchableFilter } from "./SearchableFilter";
import { cn } from "@/lib/utils";
export interface ColumnHandlers<T> {
  onDetail?: (row: T) => void;
  onUpdate?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDef {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  searchable?: boolean;
}

interface AppTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  totalPages: number;
  totalData: number;
  currentPage: number;
  isLoading?: boolean;
  searchPlaceholder?: string;
  buttonAdd?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  hiddenColumns?: string[];
  filters?: FilterDef[];
  filterIcon?: ReactNode;
  containerFilterClassName?: string;
}

export function AppTable<T extends { id?: string }>({
  data,
  columns,
  totalPages,
  totalData,
  currentPage,
  buttonAdd,
  filterIcon,
  isLoading = false,
  searchPlaceholder = "Search...",
  actions,
  hiddenColumns = [],
  containerFilterClassName,

  filters = [],
}: AppTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.key),
  );

  const updateParams = (params: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, value);
      else current.delete(key);
    });
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    updateParams({ search: value, page: "1" });
  }, 400);

  const handleFilterChange = (key: string, value: string) => {
    updateParams({ [key]: value === "all" ? "" : value, page: "1" });
  };

  const handlePage = (page: number) => {
    updateParams({ page: String(page) });
  };

  const handleLimitChange = (value: string) => {
    updateParams({ limit: value, page: "1" });
  };

  const search = searchParams.get("search") ?? "";
  const currentLimit = searchParams.get("limit") ?? "10";
  const colSpan = visibleColumns.length + (actions ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute sm:text-sm text-[12px] left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9  sm:text-sm text-[12px]"
            />
          </div>
        </div>
        <div
          className={`flex items-center sm:justify-normal justify-center gap-1 sm:gap-3 ${cn(containerFilterClassName)}`}
        >
          {filters?.map((filter) => {
            const currentValue = searchParams.get(filter?.key) ?? "all";

            const currentLabel =
              filter?.options?.find((opt) => opt?.value === currentValue)
                ?.label ??
              filter?.placeholder ??
              filter?.label;

            if (filter?.searchable) {
              return (
                <SearchableFilter
                  key={filter?.key}
                  filter={filter}
                  currentValue={currentValue}
                  currentLabel={currentLabel}
                  onSelect={(value) => handleFilterChange(filter?.key, value)}
                />
              );
            }

            return (
              <DropdownMenu key={filter?.key}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={
                      filter.className ??
                      " sm:text-sm text-[12px] w-1/2 sm:w-40 justify-between"
                    }
                  >
                    <span>{currentLabel}</span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem
                    onClick={() => handleFilterChange(filter.key, "all")}
                  >
                    {currentValue === "all" && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {filter.placeholder ?? `All ${filter.label}`}
                  </DropdownMenuItem>

                  {filter?.options?.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => handleFilterChange(filter.key, opt.value)}
                    >
                      {currentValue === opt.value && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
          {buttonAdd}
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-foreground/10">
            <TableRow>
              {visibleColumns?.map((col) => (
                <TableHead
                  key={col.key}
                  className={
                    col.hideOnMobile
                      ? "hidden whitespace-nowrap sm:table-cell"
                      : "whitespace-nowrap"
                  }
                >
                  {col.label}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="whitespace-nowrap text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-32 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="h-32 text-center text-muted-foreground"
                >
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              data?.map((row, idx) => (
                <TableRow key={row.id ?? idx}>
                  {visibleColumns?.map((col) => (
                    <TableCell
                      key={col.key}
                      className={
                        col.hideOnMobile
                          ? "hidden whitespace-nowrap   truncate max-w-[200px] sm:table-cell"
                          : "whitespace-nowrap"
                      }
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as any)[col.key] ?? "-")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="whitespace-nowrap text-right">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <span>Total {totalData} data</span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium whitespace-nowrap">
              Rows per page:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-[70px] justify-between px-2 font-normal"
                >
                  <span>{currentLimit}</span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="min-w-[70px] w-[70px]"
              >
                {["5", "10", "20"]?.map((value) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => handleLimitChange(value)}
                    className="justify-center cursor-pointer"
                  >
                    {value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePage(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <span className="px-3 font-medium text-foreground">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePage(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
