import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { LoadingBlock } from "@/components/ui/PageState";
import { CartSummaryCard } from "@/components/order/CartSummaryCard";
import { CheckoutProgress } from "@/components/order/CheckoutProgress";
import { validateDraft } from "@/lib/validation";
import { formatNaira, ymdFromToday } from "@/lib/format";
import type { CheckoutDraft } from "@/types";

export default function CheckoutPage() {
  const { lines, ready, draft, updateDraft, areas, areasLoading, areasError } =
    useCart();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  if (!ready) return <LoadingBlock />;
  if (lines.length === 0) return <Navigate to="/cart" replace />;
  if (areasLoading) return <LoadingBlock label="Loading delivery areas" />;
  if (areasError || areas.length === 0) {
    return (
      <div className="container-page pb-20 pt-12 lg:pb-28">
        <h1 className="text-4xl">Delivery areas unavailable</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          {areasError ??
            "There are no delivery areas available for checkout right now."}
        </p>
      </div>
    );
  }

  // Errors only appear after the first attempt, then stay in sync as the customer fixes each field
  const errors = submitted ? validateDraft(draft, areas) : {};

  const set = <K extends keyof CheckoutDraft>(
    key: K,
    value: CheckoutDraft[K],
  ) => updateDraft({ [key]: value });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateDraft(draft, areas)).length === 0) {
      navigate("/payment");
      return;
    }
    // Wait for the error state to render, then bring the first invalid field into view
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    });
  };

  return (
    <div className="container-page pb-20 pt-6 lg:pb-28 lg:pt-12">
      <CheckoutProgress current={1} />
      <h1 className="text-[clamp(2.5rem,6vw,4.5rem)]">Delivery details</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Full name"
              name="name"
              autoComplete="name"
              value={draft.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              error={errors.fullName}
            />
            <TextField
              label="Phone number"
              name="tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0801 234 5678"
              value={draft.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={errors.phone}
              hint="We call or message this number about your delivery."
            />
          </div>

          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            value={draft.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
          />

          <SelectField
            label="Delivery area"
            value={draft.areaId}
            onChange={(e) => set("areaId", e.target.value)}
            error={errors.areaId}
          >
            <option value="">Choose your area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({formatNaira(a.fee)})
              </option>
            ))}
          </SelectField>

          <TextAreaField
            label="Delivery address"
            name="address"
            autoComplete="street-address"
            value={draft.address}
            onChange={(e) => set("address", e.target.value)}
            error={errors.address}
            hint="Street, house number and a nearby landmark."
          />

          <TextField
            label="Preferred delivery date"
            type="date"
            min={ymdFromToday(1)}
            value={draft.preferredDate}
            onChange={(e) => set("preferredDate", e.target.value)}
            error={errors.preferredDate}
          />

          <TextAreaField
            label="Additional notes"
            optional
            value={draft.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Gate instructions, delivery time preference, allergies..."
          />

          <Button type="submit" size="lg" full className="mt-2">
            Continue to Payment
          </Button>
        </form>

        <CartSummaryCard />
      </div>
    </div>
  );
}
