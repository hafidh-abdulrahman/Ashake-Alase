export interface ServerSupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

export function getServerSupabaseConfig(): ServerSupabaseConfig | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export function supabaseServerRequest(
  url: string,
  serviceRoleKey: string,
  init?: RequestInit,
) {
  return fetch(url, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}
