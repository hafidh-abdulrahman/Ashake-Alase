import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { LoadingBlock } from "@/components/ui/PageState";
import { useAllDeliveryAreas } from "@/hooks/useData";
import {
  removeDeliveryArea,
  saveDeliveryArea,
} from "@/services/deliveryService";
import { formatNaira } from "@/lib/format";
import type { DeliveryArea } from "@/types";

const blank = (): DeliveryArea => ({
  id: `zone-${Date.now()}`,
  name: "",
  fee: 0,
  isActive: true,
});

export default function AdminDeliveryPage() {
  const { data: areas, loading, error, reload } = useAllDeliveryAreas();
  const [editing, setEditing] = useState<DeliveryArea | null>(null);
  const [busy, setBusy] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  if (loading) return <LoadingBlock label="Loading delivery areas" />;
  if (error || !areas) {
    return (
      <div className="rounded-3xl border border-bad/30 bg-bad-bg p-6 text-bad">
        <p>{error ?? "Delivery areas could not be loaded."}</p>
        <Button className="mt-4" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  const save = async () => {
    if (!editing?.name.trim() || editing.fee < 0) return;
    setBusy(true);
    setOperationError(null);
    try {
      await saveDeliveryArea({ ...editing, name: editing.name.trim() });
      setEditing(null);
      reload();
    } catch {
      setOperationError(
        "The delivery area could not be saved. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async (area: DeliveryArea) => {
    if (!window.confirm(`Remove ${area.name}?`)) return;
    setBusy(true);
    setOperationError(null);
    try {
      await removeDeliveryArea(area.id);
      reload();
    } catch {
      setOperationError(
        "The delivery area could not be removed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-primary">Delivery control</p>
          <h1 className="mt-2 text-4xl md:text-5xl">Delivery areas</h1>
          <p className="mt-2 text-ink-soft">
            Update delivery fees without editing the app code.
          </p>
        </div>
        <Button onClick={() => setEditing(blank())}>
          <Plus className="size-5" aria-hidden /> Add area
        </Button>
      </div>

      {editing && (
        <div className="mt-8 grid gap-4 rounded-3xl border border-primary/25 bg-paper p-6 shadow-lift sm:grid-cols-[1fr_12rem_auto] sm:items-end">
          <TextField
            label="Area name"
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            required
          />
          <TextField
            label="Delivery fee (₦)"
            type="number"
            min="0"
            value={editing.fee}
            onChange={(e) =>
              setEditing({ ...editing, fee: Number(e.target.value) })
            }
            required
          />
          <div className="flex gap-2 sm:mb-0.5">
            <Button onClick={save} loading={busy}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-3">
            <input
              type="checkbox"
              checked={editing.isActive}
              onChange={(e) =>
                setEditing({ ...editing, isActive: e.target.checked })
              }
            />{" "}
            Available for customers
          </label>
        </div>
      )}

      {operationError && <p className="mt-4 text-bad">{operationError}</p>}

      <div className="mt-8 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
        {areas.length === 0 && (
          <p className="p-8 text-center text-ink-soft">
            No delivery areas have been created yet.
          </p>
        )}
        {areas.map((area) => (
          <div
            key={area.id}
            className="flex flex-wrap items-center justify-between gap-4 p-5"
          >
            <div>
              <h2 className="font-bold">{area.name}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {area.isActive
                  ? "Available at checkout"
                  : "Hidden from checkout"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <strong className="font-display text-xl">
                {formatNaira(area.fee)}
              </strong>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(area)}
              >
                <Pencil className="size-4" aria-hidden /> Edit
              </Button>
              <button
                type="button"
                onClick={() => remove(area)}
                disabled={busy}
                aria-label={`Remove ${area.name}`}
                className="grid size-10 place-items-center rounded-full border border-bad/30 text-bad hover:bg-bad-bg"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
