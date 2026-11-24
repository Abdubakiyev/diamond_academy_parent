"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Trash2, UserPlus, Users } from "lucide-react";
import { fetchChildren, removeChild } from "@/lib/parentApi";
import { errMsg } from "@/lib/api";
import Spinner, { ErrorBox } from "@/components/Spinner";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";

export default function ParentDashboard() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["children"], queryFn: fetchChildren });

  const del = useMutation({
    mutationFn: removeChild,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["children"] }),
  });

  const onDelete = (id: number | string, name: string) => {
    if (window.confirm(`«${name}» ni ro'yxatdan olib tashlaysizmi?`)) del.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Farzandlarim</h1>
          <p className="text-sm text-gray-500">
            Farzandingiz natijalarini ko&apos;rish uchun uni ro&apos;yxatga qo&apos;shing
          </p>
        </div>
        <Link
          href="/parent/add"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Farzand qo&apos;shish</span>
          <span className="sm:hidden">Qo&apos;shish</span>
        </Link>
      </div>

      {q.isLoading && <Spinner />}
      {q.isError && <ErrorBox message={errMsg(q.error)} />}
      {del.isError && <ErrorBox message={errMsg(del.error)} />}

      {q.data && q.data.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Users className="h-7 w-7" />
          </span>
          <p className="font-semibold text-gray-900">Hali farzand qo&apos;shilmagan</p>
          <p className="mt-1 text-sm text-gray-500">
            Guruhni tanlang, o&apos;quvchini toping va so&apos;rov yuboring.
          </p>
          <Link
            href="/parent/add"
            className="mt-4 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white"
          >
            Farzand qo&apos;shish
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {q.data?.map((c) => {
          const approved = c.status === "APPROVED";
          const inner = (
            <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
                    {c.student.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900">{c.student.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {c.student.group?.name ?? "Guruhsiz"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>

              <p className="mt-3 text-xs text-gray-400">
                So&apos;rov: {formatDate(c.createdAt)}
              </p>
              {c.status === "PENDING" && (
                <p className="mt-2 text-xs text-amber-700">
                  Administrator tasdiqlagach statistika ochiladi.
                </p>
              )}
              {c.status === "REJECTED" && (
                <p className="mt-2 text-xs text-red-600">
                  So&apos;rov rad etildi. Markaz bilan bog&apos;laning.
                </p>
              )}

              <div className="mt-auto flex items-center justify-between pt-4">
                {approved ? (
                  <span className="flex items-center gap-1 text-sm font-semibold text-indigo-600">
                    Statistikani ko&apos;rish <ChevronRight className="h-4 w-4" />
                  </span>
                ) : (
                  <span />
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(c.id, c.student.name);
                  }}
                  disabled={del.isPending}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );

          return approved ? (
            <Link key={c.id} href={`/parent/child/${c.student.id}`}>
              {inner}
            </Link>
          ) : (
            <div key={c.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
