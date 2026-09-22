import { useState, type ChangeEvent, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField, TextAreaField } from "@/components/ui/Field";
import { FoodImage } from "@/components/ui/FoodImage";
import { LoadingBlock } from "@/components/ui/PageState";
import { useAllProducts } from "@/hooks/useData";
import { categoryLabels } from "@/data/mock/content";
import { removeProduct, saveProduct } from "@/services/productService";
import type { Product, ProductCategory } from "@/types";

const blank = (): Product => ({
  id: `item-${Date.now()}`,
  name: "",
  summary: "",
  description: "",
  price: 0,
  image: "",
  placeholder: "plate",
  includes: [],
  availableQuantity: null,
  maxPerOrder: 1,
  isActive: true,
  featured: false,
  category: "food",
});

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const readImageFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });

export default function AdminMenuPage() {
  const { data: products, loading, error, reload } = useAllProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [imageError, setImageError] = useState("");
  const [operationError, setOperationError] = useState<string | null>(null);

  if (loading) return <LoadingBlock label="Loading menu items" />;
  if (error || !products) {
    return (
      <div className="rounded-3xl border border-bad/30 bg-bad-bg p-6 text-bad">
        <p>{error ?? "Menu items could not be loaded from Supabase."}</p>
        <Button className="mt-4" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing || !editing.name.trim() || editing.price <= 0) return;
    setBusy(true);
    setOperationError(null);
    try {
      await saveProduct({
        ...editing,
        name: editing.name.trim(),
        summary: editing.summary.trim(),
        description: editing.description.trim(),
      });
      setEditing(null);
      reload();
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "The menu item could not be saved.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Remove ${product.name} from the menu?`)) return;
    setBusy(true);
    setOperationError(null);
    try {
      await removeProduct(product.id);
      reload();
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : "The menu item could not be removed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const update = <K extends keyof Product>(key: K, value: Product[K]) =>
    setEditing((item) => (item ? { ...item, [key]: value } : item));

  const onImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be smaller than 5 MB.");
      return;
    }
    setImageError("");
    update("image", await readImageFile(file));
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-primary">Catalog control</p>
          <h1 className="mt-2 text-4xl md:text-5xl">Menu items</h1>
          <p className="mt-2 text-ink-soft">
            Changes are saved in this browser for the Phase 1 demo.
          </p>
        </div>
        <Button onClick={() => setEditing(blank())}>
          <Plus className="size-5" aria-hidden /> Add item
        </Button>
      </div>

      {editing && (
        <form
          onSubmit={submit}
          className="mt-8 grid gap-5 rounded-3xl border border-primary/25 bg-paper p-6 shadow-lift lg:grid-cols-2"
        >
          <div className="lg:col-span-2 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">
              {products.some((item) => item.id === editing.id)
                ? "Edit item"
                : "New item"}
            </h2>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm font-semibold text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
          <TextField
            label="Name"
            value={editing.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          <SelectField
            label="Category"
            value={editing.category}
            onChange={(e) =>
              update("category", e.target.value as ProductCategory)
            }
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Price (₦)"
            type="number"
            min="1"
            value={editing.price || ""}
            onChange={(e) => update("price", Number(e.target.value))}
            required
          />
          <TextField
            label="Available quantity"
            type="number"
            min="0"
            placeholder="Leave blank for unlimited"
            value={editing.availableQuantity ?? ""}
            onChange={(e) =>
              update(
                "availableQuantity",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          />
          <TextField
            label="Maximum per order"
            type="number"
            min="1"
            value={editing.maxPerOrder}
            onChange={(e) =>
              update("maxPerOrder", Math.max(1, Number(e.target.value)))
            }
          />
          <div>
            <label
              htmlFor="food-image"
              className="mb-1.5 block text-sm font-semibold"
            >
              Food image
            </label>
            <input
              id="food-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onImageSelected}
              className="block w-full rounded-xl border-2 border-dashed border-line bg-paper px-4 py-3 text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-primary-dark"
            />
            <p className="mt-1.5 text-sm text-ink-soft">
              PNG, JPG or WebP, up to 5 MB. Leave unchanged to keep the current
              image.
            </p>
            {imageError && (
              <p className="mt-1.5 text-sm font-medium text-bad" role="alert">
                {imageError}
              </p>
            )}
            {editing.image && (
              <img
                src={editing.image}
                alt="Selected food preview"
                className="mt-3 h-24 w-32 rounded-xl object-cover"
              />
            )}
          </div>
          <TextField
            label="Short summary"
            value={editing.summary}
            onChange={(e) => update("summary", e.target.value)}
          />
          <TextAreaField
            label="Description"
            value={editing.description}
            onChange={(e) => update("description", e.target.value)}
          />
          <TextField
            label="Included items"
            hint="Separate items with commas"
            value={editing.includes.join(", ")}
            onChange={(e) =>
              update(
                "includes",
                e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
          />
          <TextField
            label="Campaign label"
            optional
            value={editing.campaign?.label ?? ""}
            onChange={(e) =>
              update(
                "campaign",
                e.target.value
                  ? { label: e.target.value, endsAt: editing.campaign?.endsAt }
                  : undefined,
              )
            }
            placeholder="October 1st Combo"
          />
          <TextField
            label="Campaign end date"
            type="date"
            optional
            value={editing.campaign?.endsAt ?? ""}
            onChange={(e) =>
              update(
                "campaign",
                editing.campaign || e.target.value
                  ? {
                      label: editing.campaign?.label || editing.name,
                      endsAt: e.target.value || undefined,
                    }
                  : undefined,
              )
            }
          />
          <div className="flex flex-wrap items-center gap-5 rounded-xl border border-line bg-surface p-4 lg:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={editing.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
              />{" "}
              Active on customer menu
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => update("featured", e.target.checked)}
              />{" "}
              Featured offer
            </label>
          </div>
          <div className="lg:col-span-2">
            <Button type="submit" loading={busy}>
              Save item
            </Button>
          </div>
        </form>
      )}

      {operationError && (
        <p role="alert" className="mt-4 text-sm font-medium text-bad">
          {operationError}
        </p>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-3xl border border-line bg-paper"
          >
            <div className="grid grid-cols-[8rem_1fr] gap-4 p-4">
              <FoodImage
                src={product.image}
                alt={product.name}
                placeholder={product.placeholder}
                className="aspect-square rounded-2xl"
              />
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p className="mt-1 text-sm text-ink-soft">
                      {categoryLabels[product.category]}
                    </p>
                  </div>
                  <span
                    className={
                      product.isActive
                        ? "rounded-full bg-ok-bg px-2.5 py-1 text-xs font-bold text-ok"
                        : "rounded-full bg-bad-bg px-2.5 py-1 text-xs font-bold text-bad"
                    }
                  >
                    {product.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="mt-3 font-display text-xl font-extrabold">
                  ₦{product.price.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {product.availableQuantity == null
                    ? "Unlimited stock"
                    : `${product.availableQuantity} available`}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-line px-4 py-3">
              <span className="text-sm text-ink-soft">
                {product.featured ? "Featured offer" : "Standard menu item"}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(product)}
                >
                  <Pencil className="size-4" aria-hidden /> Edit
                </Button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove(product)}
                  aria-label={`Remove ${product.name}`}
                  className="grid size-10 place-items-center rounded-full border border-bad/30 text-bad hover:bg-bad-bg"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
