import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductVisualProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export function ProductVisual({ name, imageUrl, className }: ProductVisualProps) {
  if (imageUrl) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
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
        <UtensilsCrossed className="size-8 text-accent" />
        <p className="text-sm font-semibold text-foreground">{name}</p>
      </div>
    </div>
  );
}
