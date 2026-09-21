import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase client (Phase 2).
 * In Phase 1 no keys are set, so `supabase` is null and every service falls back to mock data.
 * Once VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, services can branch on `isSupabaseConfigured`.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null
