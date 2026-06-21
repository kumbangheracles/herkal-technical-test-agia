"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { X, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

interface ImageUploadProps {
  /** Nilai awal gambar (bisa berupa URL string atau object File) */
  value?: string | File | null;
  /** Callback ketika gambar dipilih atau dihapus */
  onChange?: (file: File | null) => void;
  /** Class tambahan untuk container utama */
  className?: string;
  /** Teks placeholder ketika belum ada gambar */
  placeholder?: string;
  /** Menonaktifkan input */
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  className,
  placeholder = "Upload an image",
  disabled = false,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof value === "string") {
      setPreviewUrl(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("File harus berupa gambar (JPG, PNG, WEBP, atau GIF)");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran file maksimal 2MB");
      e.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onChange?.(file);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setPreviewUrl(null);
    onChange?.(null);
  };

  const triggerUpload = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      {previewUrl ? (
        <div className="relative rounded-2xl w-full max-w-sm aspect-video bg-accent/50 border border-border overflow-hidden group">
          <Image
            alt="Preview"
            fill
            className="object-contain w-full h-full"
            src={previewUrl}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full shadow-sm"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Hapus gambar</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerUpload}
          className={cn(
            "rounded-2xl w-full max-w-sm aspect-video bg-accent/30 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-accent/50",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
            <UploadCloud className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">{placeholder}</p>
            <p className="text-xs mt-1">Klik untuk memilih file</p>
          </div>
        </div>
      )}
    </div>
  );
}
