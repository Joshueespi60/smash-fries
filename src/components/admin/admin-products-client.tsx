"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import type { Category, Product } from "@/types";

type AdminProductsClientProps = {
  initialProducts: Product[];
  categories: Category[];
};

type ProductForm = {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string;
  price: string;
  category_id: string;
  is_available: boolean;
  is_featured: boolean;
};

const emptyForm: ProductForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  ingredients: "",
  price: "",
  category_id: "",
  is_available: true,
  is_featured: false,
};

export function AdminProductsClient({
  initialProducts,
  categories,
}: AdminProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const openCreate = () => {
    setForm({
      ...emptyForm,
      category_id: categories[0]?.id ?? "",
    });
    setOpen(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      ingredients: product.ingredients ?? "",
      price: String(product.price),
      category_id: product.category_id ?? categories[0]?.id ?? "",
      is_available: product.is_available,
      is_featured: product.is_featured,
    });
    setOpen(true);
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`Eliminar ${product.name}?`);
    if (!confirmed) {
      return;
    }

    const previous = products;
    setProducts((current) => current.filter((item) => item.id !== product.id));

    if (!isSupabaseConfigured) {
      toast.success("Producto eliminado en modo local");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        toast.error("Supabase no disponible, se mantiene en local");
        return;
      }

      const result = await supabase.from("products").delete().eq("id", product.id);
      if (result.error) {
        setProducts(previous);
        toast.error("No se pudo eliminar en Supabase");
      } else {
        toast.success("Producto eliminado");
      }
    } catch {
      setProducts(previous);
      toast.error("Error eliminando en Supabase");
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.slug.trim() || !form.price.trim()) {
      toast.error("Nombre, slug y precio son obligatorios");
      return;
    }

    const numericPrice = Number(form.price);
    if (!Number.isFinite(numericPrice)) {
      toast.error("El precio no es válido");
      return;
    }

    setSaving(true);

    const id = form.id || crypto.randomUUID();
    const nextProduct: Product = {
      id,
      category_id: form.category_id || null,
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      ingredients: form.ingredients.trim() || null,
      price: numericPrice,
      image_url: null,
      is_available: form.is_available,
      is_featured: form.is_featured,
      sort_order: 0,
      addons: [],
      category: null,
    };

    setProducts((current) => {
      const exists = current.some((item) => item.id === id);
      if (exists) {
        return current.map((item) => (item.id === id ? nextProduct : item));
      }
      return [nextProduct, ...current];
    });

    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const result = await supabase.from("products").upsert({
            id,
            category_id: nextProduct.category_id,
            name: nextProduct.name,
            slug: nextProduct.slug,
            description: nextProduct.description,
            ingredients: nextProduct.ingredients,
            price: nextProduct.price,
            is_available: nextProduct.is_available,
            is_featured: nextProduct.is_featured,
          });

          if (result.error) {
            toast.error("Guardado local ok, Supabase rechazo el cambio");
          } else {
            toast.success("Producto guardado en Supabase");
          }
        }
      } catch {
        toast.error("Guardado local ok, fallo de Supabase");
      }
    } else {
      toast.success("Producto guardado en modo local");
    }

    setSaving(false);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" />
          Nuevo producto
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-card text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Disponible</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {categoryMap.get(product.category_id ?? "") ?? "Sin categoría"}
                </td>
                <td className="px-4 py-3 text-accent">{formatCurrency(product.price)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.is_available ? "Sí" : "No"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.is_featured ? "Sí" : "No"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="rounded-md border border-border px-2 py-1 text-xs text-foreground"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="rounded-md border border-destructive px-2 py-1 text-xs text-destructive"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/35 p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-xl space-y-3 rounded-2xl border border-border bg-card p-5"
          >
            <h3 className="text-lg font-bold text-foreground">
              {form.id ? "Editar producto" : "Nuevo producto"}
            </h3>

            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nombre"
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-foreground"
            />
            <input
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              placeholder="Slug"
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-foreground"
            />
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Descripción"
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-foreground"
            />
            <textarea
              value={form.ingredients}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, ingredients: event.target.value }))
              }
              placeholder="Ingredientes"
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-foreground"
            />
            <input
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Precio"
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-foreground"
            />
            <select
              value={form.category_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category_id: event.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-foreground"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3 text-sm text-foreground/90">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, is_available: event.target.checked }))
                  }
                />
                Disponible
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, is_featured: event.target.checked }))
                  }
                />
                Destacado
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
