"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Search, Users } from "lucide-react";
import { fetchGroups, fetchGroupStudents, requestChild } from "@/lib/parentApi";
import { errMsg } from "@/lib/api";
import Spinner, { ErrorBox } from "@/components/Spinner";
import type { GroupItem, StudentItem } from "@/types/parent";

export default function AddChildPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [group, setGroup] = useState<GroupItem | null>(null);
  const [student, setStudent] = useState<StudentItem | null>(null);
  const [search, setSearch] = useState("");

  const groups = useQuery({ queryKey: ["groups"], queryFn: fetchGroups });
  const students = useQuery({
    queryKey: ["group-students", group?.id],
    queryFn: () => fetchGroupStudents(group!.id),
    enabled: !!group,
  });

  const send = useMutation({
    mutationFn: () => requestChild(student!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["children"] });
      router.replace("/parent");
    },
  });

  const filtered = (students.data ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/parent"
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" /> Orqaga
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Farzand qo&apos;shish</h1>
        <p className="text-sm text-gray-500">
          1) Guruhni tanlang &nbsp;→&nbsp; 2) O&apos;quvchini tanlang &nbsp;→&nbsp; 3) So&apos;rov yuboring
        </p>
      </div>

      {/* Step 1 */}
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
            1
          </span>
          Guruh
        </h2>
        {groups.isLoading && <Spinner />}
        {groups.isError && <ErrorBox message={errMsg(groups.error)} />}
        <div className="grid gap-2 sm:grid-cols-2">
          {groups.data?.map((g) => {
            const active = group?.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  setGroup(g);
                  setStudent(null);
                  setSearch("");
                }}
                className={`rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <p className="font-semibold text-gray-900">{g.name}</p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  {g.schedule && <span>{g.schedule}</span>}
                  {g._count && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {g._count.students}
                    </span>
                  )}
                </p>
              </button>
            );
          })}
        </div>
        {groups.data?.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">Guruhlar topilmadi</p>
        )}
      </section>

      {/* Step 2 */}
      {group && (
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
              2
            </span>
            O&apos;quvchi — {group.name}
          </h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism bo'yicha qidirish"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          {students.isLoading && <Spinner />}
          {students.isError && <ErrorBox message={errMsg(students.error)} />}
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {filtered.map((s) => {
              const active = student?.id === s.id;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setStudent(s)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                        : "border-gray-200 text-gray-800 hover:border-indigo-300"
                    }`}
                  >
                    {s.name}
                    {active && <Check className="h-4 w-4 text-indigo-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
          {students.data && filtered.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">O&apos;quvchi topilmadi</p>
          )}
        </section>
      )}

      {/* Step 3 */}
      {student && (
        <section className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-5">
          <p className="text-sm text-gray-700">
            <b>{student.name}</b> uchun so&apos;rov yuboriladi. Administrator tasdiqlagach
            statistikani ko&apos;rasiz.
          </p>
          {send.isError && (
            <div className="mt-3">
              <ErrorBox message={errMsg(send.error)} />
            </div>
          )}
          <button
            onClick={() => send.mutate()}
            disabled={send.isPending}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow disabled:opacity-60"
          >
            {send.isPending ? "Yuborilmoqda..." : "So'rov yuborish"}
          </button>
        </section>
      )}
    </div>
  );
}
