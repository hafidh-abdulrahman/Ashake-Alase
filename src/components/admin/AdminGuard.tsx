import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingBlock } from "@/components/ui/PageState";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const isAdminSession = (session: Session | null) =>
  session?.user.app_metadata?.role === "admin";

export function AdminGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [access, setAccess] = useState<"anonymous" | "forbidden" | "allowed">(
    "anonymous",
  );

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAccess(
        data.session
          ? isAdminSession(data.session)
            ? "allowed"
            : "forbidden"
          : "anonymous",
      );
      setChecking(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAccess(
        session
          ? isAdminSession(session)
            ? "allowed"
            : "forbidden"
          : "anonymous",
      );
      setChecking(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) return <LoadingBlock label="Checking admin session" />;
  if (!supabase || access === "anonymous") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  if (access === "forbidden") return <Navigate to="/" replace />;
  return <>{children}</>;
}
