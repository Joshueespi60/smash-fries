"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, UtensilsCrossed } from "lucide-react";
import { sanitizeExternalUrl } from "@/lib/security";
import { cn } from "@/lib/utils";

type ProductVisualProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export function ProductVisual({ name, imageUrl, className }: ProductVisualProps) {
  const normalizedImageUrl = sanitizeExternalUrl(imageUrl, {
    allowRelativePath: true,
  });
  const hasImage = Boolean(normalizedImageUrl);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasImageError = Boolean(normalizedImageUrl && failedImageUrl === normalizedImageUrl);

  if (hasImage && normalizedImageUrl && !hasImageError) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={normalizedImageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          onError={() => setFailedImageUrl(normalizedImageUrl)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/35 via-background to-accent/20",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        {hasImage ? (
          <ImageOff className="size-8 text-accent" />
        ) : (
          <UtensilsCrossed className="size-8 text-accent" />
        )}
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/85">
          Imagen no disponible
        </p>
      </div>
    </div>
  );
}
