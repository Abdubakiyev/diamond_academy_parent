"use client";

import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const { ready, user } = useAuthGuard();

  if (!ready) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
