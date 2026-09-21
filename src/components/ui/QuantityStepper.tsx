import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  size?: "md" | "sm";
}

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label = "Quantity",
  size = "md",
}: Props) {
  const btn = cn(
    "grid place-items-center rounded-full border-2 border-primary/70 text-primary transition-colors",
    "hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-35",
    size === "md" ? "size-11" : "size-9",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-3"
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <output
        aria-live="polite"
        className={cn(
          "min-w-8 text-center font-display font-bold tabular-nums",
          size === "md" ? "text-2xl" : "text-lg",
        )}
      >
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
