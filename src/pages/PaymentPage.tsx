import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Copy, Check, FileText, Info, Upload, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { site, RECEIPT_ACCEPT } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { LoadingBlock } from "@/components/ui/PageState";
import { CartSummaryCard } from "@/components/order/CartSummaryCard";
import { CheckoutProgress } from "@/components/order/CheckoutProgress";
import { validateDraft } from "@/lib/validation";
import { formatFileSize, formatNaira, formatPlainDate } from "@/lib/format";
import { createOrder } from "@/services/orderService";
import { validateReceipt } from "@/services/paymentService";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the value is still visible to copy manually */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="inline-flex items-center gap-1.5 rounded-full border-2 border-line px-3 py-1.5 text-sm font-semibold transition-colors hover:border-ink"
    >
      {copied ? (
        <Check className="size-4 text-ok" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function PaymentPage() {
  const {
    lines,
    ready,
    draft,
    areas,
    selectedArea,
    deliveryFee,
    total,
    receiptFile,
    setReceiptFile,
    clear,
  } = useCart();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const placing = useRef(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!receiptFile || !receiptFile.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(receiptFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [receiptFile]);

  if (!ready) return <LoadingBlock />;
  if (placing.current) return null;
  if (lines.length === 0) return <Navigate to="/cart" replace />;
  if (Object.keys(validateDraft(draft, areas)).length > 0 || !selectedArea)
    return <Navigate to="/checkout" replace />;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateReceipt(file);
    setFileError(problem);
    setSubmitError(null);
    setReceiptFile(problem ? null : file);
  };

  const placeOrder = async () => {
    setBusy(true);
    setSubmitError(null);
    try {
      const order = await createOrder({
        draft,
        areaName: selectedArea.name,
        items: lines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          unitPrice: l.product.price,
          quantity: l.quantity,
        })),
        deliveryFee: deliveryFee ?? 0,
      });
      placing.current = true;
      clear();
      navigate(`/order/${order.orderNumber}`, { replace: true });
    } catch {
      setSubmitError(
        "We could not place your order. Check your connection and try again.",
      );
      setBusy(false);
    }
  };

  const bankRows = [
    { label: "Bank name", value: site.bank.name },
    { label: "Account name", value: site.bank.accountName },
    {
      label: "Account number",
      value: site.bank.accountNumber,
      copy: true,
      big: true,
    },
  ];

  return (
    <div className="container-page pb-20 pt-6 lg:pb-28 lg:pt-12">
      <CheckoutProgress current={2} />
      <h1 className="text-[clamp(2.5rem,6vw,4.5rem)]">Payment</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="space-y-8">
          <section aria-labelledby="transfer">
            <h2 id="transfer" className="text-2xl font-bold">
              1. Pay by bank transfer
            </h2>
            <p className="mt-2 text-ink-soft">
              Transfer exactly{" "}
              <strong className="text-ink">{formatNaira(total)}</strong> to the
              account below.
            </p>
            <div className="mt-4 divide-y divide-line rounded-3xl border border-line bg-paper">
              {bankRows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div>
                    <p className="text-sm text-ink-soft">{r.label}</p>
                    <p
                      className={
                        r.big
                          ? "font-display text-3xl font-extrabold tracking-wider tabular-nums"
                          : "text-lg font-semibold"
                      }
                    >
                      {r.value}
                    </p>
                  </div>
                  {r.copy && <CopyButton value={r.value} label={r.label} />}
                </div>
              ))}
            </div>
            {import.meta.env.DEV && (
              <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />{" "}
                Developer note: these are placeholder bank details. Set
                VITE_BANK_* in your environment.
              </p>
            )}
          </section>

          <section aria-labelledby="receipt">
            <h2 id="receipt" className="text-2xl font-bold">
              2. Payment details
            </h2>
            <p className="mt-2 text-ink-soft">
              Payment is pending for now. Receipt upload can be completed in a
              later payment phase.
            </p>

            <input
              ref={inputRef}
              type="file"
              accept={RECEIPT_ACCEPT}
              onChange={onFile}
              className="sr-only"
              id="receipt-input"
              aria-describedby={fileError ? "receipt-error" : undefined}
            />

            {receiptFile ? (
              <div className="mt-4 flex items-center gap-4 rounded-3xl border-2 border-ink bg-paper p-4">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-alt">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Receipt preview"
                      className="size-full object-cover"
                    />
                  ) : (
                    <FileText className="size-7" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{receiptFile.name}</p>
                  <p className="text-sm text-ink-soft">
                    {formatFileSize(receiptFile.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-ink/5"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setReceiptFile(null)}
                    aria-label="Remove receipt"
                    className="grid size-9 place-items-center rounded-full hover:bg-ink/5"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="receipt-input"
                className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-ink/40 bg-paper px-6 py-10 text-center transition-colors hover:border-ink hover:bg-surface-alt focus-within:border-ink"
              >
                <Upload className="size-7 text-primary" aria-hidden />
                <span className="text-lg font-semibold">
                  Upload a receipt (optional)
                </span>
                <span className="text-sm text-ink-soft">
                  Tap to choose a file, or continue without one
                </span>
              </label>
            )}
            {fileError && (
              <p
                id="receipt-error"
                role="alert"
                className="mt-2 text-sm font-medium text-bad"
              >
                {fileError}
              </p>
            )}
          </section>

          <section aria-labelledby="place">
            <h2 id="place" className="text-2xl font-bold">
              3. Place your order
            </h2>
            <div className="mt-3 flex items-start gap-3 rounded-2xl bg-warn-bg p-4 text-warn">
              <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="text-[0.95rem]">
                Your order will be received with payment status pending. Payment
                processing will be connected in a later phase.
              </p>
            </div>
            {submitError && (
              <p role="alert" className="mt-3 text-sm font-medium text-bad">
                {submitError}
              </p>
            )}
            <Button
              size="lg"
              full
              className="mt-4"
              onClick={placeOrder}
              loading={busy}
            >
              {busy ? "Placing order" : `Place Order (${formatNaira(total)})`}
            </Button>
          </section>
        </div>

        <div className="space-y-6">
          <CartSummaryCard />
          <div className="rounded-3xl border border-line bg-paper p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold">Delivering to</h2>
              <Link
                to="/checkout"
                className="text-sm font-semibold underline underline-offset-4 hover:text-primary"
              >
                Edit
              </Link>
            </div>
            <p className="font-semibold">{draft.fullName}</p>
            <p className="text-ink-soft">{draft.phone}</p>
            <p className="mt-2">{draft.address}</p>
            <p className="text-ink-soft">{selectedArea.name}</p>
            <p className="mt-2 text-sm text-ink-soft">
              Preferred date: {formatPlainDate(draft.preferredDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
