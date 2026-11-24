"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/token";
import type { ParentUser } from "@/types/parent";

/** Token bo'lmasa /login ga yo'naltiradi. ready=true bo'lganda sahifani ko'rsatish mumkin. */
export function useAuthGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<ParentUser | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setUser(getUser());
    setReady(true);
  }, [router]);

  return { ready, user };
}
