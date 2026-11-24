"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/token";
import Spinner from "@/components/Spinner";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getToken() ? "/parent" : "/login");
  }, [router]);
  return <Spinner />;
}
