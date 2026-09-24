import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { site } from "@/config/site";
import { supabase } from "@/lib/supabase";
import { Seo } from "@/components/Seo";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const from = (location.state as { from?: { pathname?: string } } | null)
    ?.from;
  const seo = (
    <Seo
      title="Admin Login | Ashake Alase"
      description="Private Ashake Alase administration login."
      path="/admin/login"
      indexable={false}
    />
  );

  if (!supabase) {
    return (
      <>
        {seo}
        <main className="grid min-h-dvh place-items-center bg-surface px-5 py-10">
          <section className="w-full max-w-md rounded-3xl border border-line bg-paper p-8 shadow-lift">
            <p className="eyebrow text-primary">{site.name}</p>
            <h1 className="mt-3 text-4xl">Admin Login</h1>
            <p className="mt-4 text-ink-soft">
              Supabase authentication is not configured for this environment.
            </p>
          </section>
        </main>
      </>
    );
  }

  const authClient = supabase;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error: signInError } =
      await authClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
    if (signInError) {
      setError("Invalid email or password. Please try again.");
      setBusy(false);
      return;
    }
    if (data.user?.app_metadata?.role !== "admin") {
      await authClient.auth.signOut();
      setError("You do not have permission to access the admin dashboard.");
      setBusy(false);
      return;
    }
    navigate(from?.pathname?.startsWith("/admin/") ? from.pathname : "/admin", {
      replace: true,
    });
  };

  return (
    <>
      {seo}
      <main className="grid min-h-dvh place-items-center bg-surface px-5 py-10">
        <section className="w-full max-w-md rounded-3xl border border-line bg-paper p-8 shadow-lift">
          <img
            src={site.logo}
            alt={site.name}
            className="size-14 object-contain"
          />
          <p className="eyebrow mt-6 text-primary">{site.name}</p>
          <h1 className="mt-3 text-4xl">Admin Login</h1>
          <p className="mt-3 text-ink-soft">
            Sign in to manage orders and operations.
          </p>
          <form className="mt-8 space-y-5" onSubmit={submit}>
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && (
              <p role="alert" className="text-sm font-medium text-bad">
                {error}
              </p>
            )}
            <Button type="submit" full loading={busy}>
              {busy ? "Signing in" : "Login"}
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}
