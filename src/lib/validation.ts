import type { CheckoutDraft } from "@/types";
import { ymdFromToday } from "./format";

export type DraftErrors = Partial<Record<keyof CheckoutDraft, string>>;

/** Accepts 08012345678, 0801 234 5678, +2348012345678, 2348012345678 */
export const NIGERIAN_PHONE = /^(?:\+?234|0)[789][01]\d{8}$/;

export function validateDraft(d: CheckoutDraft): DraftErrors {
  const errors: DraftErrors = {};
  if (d.fullName.trim().length < 3) errors.fullName = "Enter your full name.";
  const phone = d.phone.replace(/[\s\-()]/g, "");
  if (!phone) errors.phone = "Enter a phone number we can reach you on.";
  else if (!NIGERIAN_PHONE.test(phone))
    errors.phone =
      "Enter a valid Nigerian phone number, for example 0801 234 5678.";
  if (!d.email.trim())
    errors.email = "Enter an email address we can reach you on.";
  else if (!/^\S+@\S+\.\S+$/.test(d.email.trim()))
    errors.email = "Enter a valid email address.";
  if (d.address.trim().length < 8)
    errors.address =
      "Enter the full delivery address, including street and landmark.";
  if (!d.preferredDate) errors.preferredDate = "Choose a delivery date.";
  else if (d.preferredDate < ymdFromToday(1))
    errors.preferredDate = "Choose a date from tomorrow onwards.";
  return errors;
}
