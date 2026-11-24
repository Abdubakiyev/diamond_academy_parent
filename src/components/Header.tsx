"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gem, LogOut, UserPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { clearSession } from "@/lib/token";
import type { ParentUser } from "@/types/parent";

export default function Header({ user }: { user: ParentUser | null }) {
  const router = useRouter();
  const qc = useQueryClient();

  const logout = () => {
    clearSession();
    qc.clear();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/parent" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow">
            <Gem className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-gray-900">
              Diamond Academy
            </span>
            <span className="block text-[11px] text-gray-500">
              Ota-onalar kabineti
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/parent/add"
            className="hidden items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 sm:flex"
          >
            <UserPlus className="h-4 w-4" />
            Farzand qo&apos;shish
          </Link>
          {user?.name && (
            <span className="hidden max-w-[140px] truncate text-sm text-gray-600 md:block">
              {user.name}
            </span>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Chiqish"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </div>
    </header>
  );
}
