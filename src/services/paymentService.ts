import type { PaymentReceipt } from '@/types'
import { RECEIPT_MAX_BYTES } from '@/config/site'

/**
 * Payment helpers.
 * Phase 1: bank transfer only. The receipt is validated and a small preview is kept in the browser.
 * Phase 2: upload the file to a private Supabase Storage bucket and store its path on the payment row.
 * Later (optional): add Paystack / Flutterwave initialisation and webhook verification here.
 */

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
const PREVIEW_MAX_BYTES = 800 * 1024

export function validateReceipt(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Upload a photo (JPG, PNG, WebP) or a PDF of your receipt.'
  if (file.size > RECEIPT_MAX_BYTES) return 'This file is larger than 5 MB. Upload a smaller photo or screenshot.'
  return null
}

const readAsDataUrl = (file: File) =>
  new Promise<string | undefined>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : undefined)
    reader.onerror = () => resolve(undefined)
    reader.readAsDataURL(file)
  })

export async function prepareReceipt(file: File): Promise<PaymentReceipt> {
  const canPreview = file.type.startsWith('image/') && file.size <= PREVIEW_MAX_BYTES
  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    previewDataUrl: canPreview ? await readAsDataUrl(file) : undefined,
  }
}
