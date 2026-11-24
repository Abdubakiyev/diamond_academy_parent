"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Gem, Loader2, Lock, Phone, User } from "lucide-react";
import { registerOrLogin } from "@/lib/parentApi";
import { errMsg } from "@/lib/api";
import { getToken, saveSession } from "@/lib/token";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getToken()) router.replace("/parent");
  }, [router]);

  const m = useMutation({
    mutationFn: registerOrLogin,
    onSuccess: (res) => {
      saveSession(res.accessToken, res.user);
      router.replace("/parent");
    },
    onError: (e) => setError(errMsg(e, "Kirishda xatolik")),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) return setError("Telefon raqamni to'liq kiriting");
    if (password.length < 6) return setError("Parol kamida 6 ta belgi bo'lsin");
    if (mode === "register" && name.trim().length < 2)
      return setError("Ismingizni kiriting");

    m.mutate({
      // Backend DTO ism talab qiladi (kamida 2 belgi) — kirishda placeholder
      name: mode === "register" ? name.trim() : "Ota-ona",
      phone: phone.trim(),
      password,
    });
  };

  const input =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
            <Gem className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900">Diamond Academy</h1>
          <p className="mt-1 text-sm text-gray-500">Ota-onalar kabineti</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1 text-sm font-semibold">
            {(["login", "register"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setMode(k);
                  setError("");
                }}
                className={`rounded-lg py-2 transition ${
                  mode === k ? "bg-white text-indigo-700 shadow" : "text-gray-500"
                }`}
              >
                {k === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  className={input}
                  placeholder="Ism familiyangiz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className={input}
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className={`${input} pr-10`}
                type={show ? "text" : "password"}
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Parolni ko'rsatish"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={m.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
            >
              {m.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
            </button>
          </form>

          {mode === "login" && (
            <p className="mt-4 text-center text-xs text-gray-500">
              Akkauntingiz yo&apos;qmi? «Ro&apos;yxatdan o&apos;tish» ni tanlang.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
