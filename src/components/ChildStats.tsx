"use client";

import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Gem,
  GraduationCap,
  Trophy,
  XCircle,
} from "lucide-react";
import type { ChildStatsData, ExamAttempt } from "@/types/stats";
import {
  cefrColor,
  formatDate,
  formatMoney,
  formatShort,
  isPaid,
  monthLabel,
} from "@/lib/format";

const MAX_SKILL = 75;

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Ring({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-extrabold">{pct}%</span>
        <span className="text-[10px] uppercase tracking-wide opacity-80">davomat</span>
      </div>
    </div>
  );
}

function SkillBar({ label, value }: { label: string; value: number | null }) {
  const pct = value == null ? 0 : Math.min(100, (value / MAX_SKILL) * 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 font-bold text-gray-500">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right font-semibold text-gray-700">
        {value == null ? "—" : value}
      </span>
    </div>
  );
}

function ExamCard({ a }: { a: ExamAttempt }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">{a.title}</p>
          <p className="text-xs text-gray-500">
            {formatDate(a.finishedAt || a.startedAt)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {a.cefr && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cefrColor(a.cefr)}`}>
              {a.cefr}
            </span>
          )}
          <span className="text-sm font-bold text-indigo-600">
            {a.total == null ? "—" : `${a.total} ball`}
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        <SkillBar label="L" value={a.listening} />
        <SkillBar label="R" value={a.reading} />
        <SkillBar label="W" value={a.writing} />
        <SkillBar label="S" value={a.speaking} />
      </div>
    </div>
  );
}

export default function ChildStats({ data }: { data: ChildStatsData }) {
  const { student, attendance, diamonds, payment, exams } = data;
  const cur = payment.currentMonth;
  const paidNow = isPaid(cur.status);
  const levelType =
    typeof student.level === "string" ? student.level : student.level?.type;

  const recent = attendance.recent.slice(0, 30);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest opacity-80">O&apos;quvchi</p>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{student.name}</h1>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {student.group && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  {student.group.name}
                </span>
              )}
              {student.group?.schedule && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  {student.group.schedule}
                </span>
              )}
              {levelType && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  {levelType}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  student.isActive ? "bg-emerald-400/90 text-emerald-950" : "bg-white/30"
                }`}
              >
                {student.isActive ? "Faol" : "Nofaol"}
              </span>
            </div>
          </div>
          <Ring value={attendance.rate} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Olmos", value: diamonds, icon: <Gem className="h-4 w-4" /> },
            { label: "Darslar", value: attendance.total, icon: <CalendarCheck className="h-4 w-4" /> },
            { label: "Imtihon", value: exams.count, icon: <GraduationCap className="h-4 w-4" /> },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur">
              <div className="mb-1 flex items-center justify-center gap-1 text-xs opacity-80">
                {s.icon}
                {s.label}
              </div>
              <div className="text-xl font-extrabold">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance */}
      <Card title="Davomat" icon={<CalendarCheck className="h-4 w-4" />}>
        <div className="mb-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="text-xl font-bold text-gray-900">{attendance.total}</div>
            <div className="text-xs text-gray-500">Jami</div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3">
            <div className="text-xl font-bold text-emerald-600">{attendance.present}</div>
            <div className="text-xs text-emerald-700">Keldi</div>
          </div>
          <div className="rounded-2xl bg-red-50 p-3">
            <div className="text-xl font-bold text-red-600">{attendance.absent}</div>
            <div className="text-xs text-red-700">Kelmadi</div>
          </div>
        </div>
        {recent.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">Hali davomat yo&apos;q</p>
        ) : (
          <>
            <p className="mb-2 text-xs font-medium text-gray-500">So&apos;nggi darslar</p>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">
              {recent.map((r, i) => (
                <div
                  key={`${r.date}-${i}`}
                  title={formatDate(r.date)}
                  className={`flex flex-col items-center rounded-xl py-2 text-[11px] font-semibold ${
                    r.present
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {r.present ? (
                    <CheckCircle2 className="mb-0.5 h-4 w-4" />
                  ) : (
                    <XCircle className="mb-0.5 h-4 w-4" />
                  )}
                  {formatShort(r.date)}
                  {r.present && r.diamond ? (
                    <span className="mt-0.5 flex items-center gap-0.5 text-[10px] text-indigo-600">
                      <Gem className="h-2.5 w-2.5" />
                      {r.diamond}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Payments */}
      <Card title="Oylik to'lov" icon={<CreditCard className="h-4 w-4" />}>
        <div
          className={`mb-4 flex items-center justify-between rounded-2xl border p-4 ${
            paidNow
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div>
            <p className="text-xs text-gray-500">Joriy oy</p>
            <p className="font-bold text-gray-900">{monthLabel(cur.month)}</p>
            {paidNow && <p className="text-xs text-gray-500">{formatDate(cur.paidAt)}</p>}
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                paidNow ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
              }`}
            >
              {paidNow ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              {paidNow ? "To'langan" : "To'lanmagan"}
            </span>
            {cur.amount != null && (
              <p className="mt-1 text-sm font-semibold text-gray-800">{formatMoney(cur.amount)}</p>
            )}
          </div>
        </div>

        {payment.history.length === 0 ? (
          <p className="py-2 text-center text-sm text-gray-500">To&apos;lovlar tarixi yo&apos;q</p>
        ) : (
          <ul className="space-y-2">
            {payment.history.map((p) => {
              const ok = isPaid(p.status);
              return (
                <li
                  key={p.id}
                  className="flex overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60"
                >
                  <span className={`w-1.5 ${ok ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <div className="flex flex-1 items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{monthLabel(p.month)}</p>
                      <p className="text-xs text-gray-500">{ok ? formatDate(p.paidAt) : "Kutilmoqda"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatMoney(p.amount)}</p>
                      <p className={`text-xs font-medium ${ok ? "text-emerald-600" : "text-amber-600"}`}>
                        {ok ? "To'langan" : "To'lanmagan"}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Exams */}
      <Card title="Imtihon natijalari" icon={<Trophy className="h-4 w-4" />}>
        <div className="mb-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-gray-50 p-3">
            <div className="text-xl font-bold text-gray-900">{exams.count}</div>
            <div className="text-xs text-gray-500">Urinishlar</div>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-3">
            <div className="text-xl font-bold text-indigo-600">{exams.bestScore ?? "—"}</div>
            <div className="text-xs text-indigo-700">Eng yuqori ball</div>
          </div>
          <div className="rounded-2xl bg-violet-50 p-3">
            <div className="text-xl font-bold text-violet-600">{exams.lastCefr ?? "—"}</div>
            <div className="text-xs text-violet-700">Oxirgi CEFR</div>
          </div>
        </div>
        {exams.attempts.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">Hali imtihon topshirilmagan</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {exams.attempts.map((a) => (
              <ExamCard key={a.id} a={a} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
