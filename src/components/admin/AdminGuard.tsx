import type { ReactNode } from 'react'

/**
 * PHASE 2: protect the admin area with Supabase Auth.
 * Suggested approach: read the session with supabase.auth.getSession(), redirect to /admin/login
 * when there is none, and check the user's role (e.g. an `admins` table) before rendering children.
 * Phase 1 has no authentication, so this simply renders its children.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  return <>{children}</>
}
