import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared Supabase client for the integration phases.
 * The app continues using local mock data until services explicitly opt into Supabase.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
