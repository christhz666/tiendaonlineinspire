"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Leaf, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const urlError = searchParams.get("error");
  const nextUrl = searchParams.get("next") || "/admin";

  const errorMessage = (() => {
    if (error) return error;
    if (urlError === "not_admin") {
      return "Tu cuenta existe pero no tiene permisos de admin.";
    }
    return null;
  })();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedUser = username.trim();

    // Step 1: resolve username -> email via RPC
    const { data: resolvedEmail, error: rpcError } = await supabase.rpc(
      "get_admin_email_by_username",
      { p_username: trimmedUser }
    );

    if (rpcError || !resolvedEmail) {
      setLoading(false);
      setError("Usuario o contraseña incorrectos");
      return;
    }

    // Step 2: sign in with the resolved email
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: resolvedEmail as string,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Usuario o contraseña incorrectos");
      return;
    }

    // Full reload so middleware picks up the new session cookie
    window.location.href = nextUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/5 border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter">
                  Panel Admin
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mt-1">
                  Inspire Su Vida
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Accede con tu cuenta autorizada
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {mounted && errorMessage && (
              <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-2">
                <UserIcon className="w-3 h-3" />
                Usuario
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user"
                required
                autoFocus
                autoComplete="username"
                className="py-6 rounded-2xl border-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                autoComplete="current-password"
                className="py-6 rounded-2xl border-2"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          Acceso restringido a administradores autorizados
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
