"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchChildStats } from "@/lib/parentApi";
import { errMsg } from "@/lib/api";
import Spinner, { ErrorBox } from "@/components/Spinner";
import ChildStats from "@/components/ChildStats";

export default function ChildPage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;

  const q = useQuery({
    queryKey: ["child-stats", studentId],
    queryFn: () => fetchChildStats(studentId),
    enabled: !!studentId,
    retry: false,
  });

  return (
    <div className="space-y-5">
      <Link
        href="/parent"
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" /> Farzandlarim
      </Link>

      {q.isLoading && <Spinner />}
      {q.isError && <ErrorBox message={errMsg(q.error, "Statistikani yuklab bo'lmadi")} />}
      {q.data && <ChildStats data={q.data} />}
    </div>
  );
}
