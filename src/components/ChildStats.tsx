"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  Trophy,
  X,
  Check,
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

/*
  Shrift: app/layout.tsx ichida qo'shing:
  import { Bricolage_Grotesque } from "next/font/google";
  const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
  <body className={display.variable}>
*/
const DISPLAY = { fontFamily: "var(--font-display), ui-sans-serif, system-ui" };

const MAX_SKILL = 75;

/* ---------- Diamond (asosiy e'tibor nuqtasi) ---------- */
function DiamondMark({ count, ready }: { count: number; ready: boolean }) {
  return (
    <div className="relative mx-auto w-48 shrink-0 sm:w-56">
      <svg
        viewBox="0 0 200 180"
        className={`w-full drop-shadow-[0_18px_40px_rgba(120,200,255,0.35)] transition-all duration-1000 ease-out motion-reduce:transition-none ${
          ready ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        aria-hidden
      >
        <defs>
          <linearGradient id="dg-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#bdf4ff" />
            <stop offset="1" stopColor="#6d5bf0" />
          </linearGradient>
          <linearGradient id="dg-b" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#3b2fb8" />
            <stop offset="1" stopColor="#8fd9ff" />
          </linearGradient>
        </defs>
        {/* crown */}
        <polygon points="50,10 100,10 80,65 5,65" fill="url(#dg-a)" opacity="0.95" />
        <polygon points="100,10 150,10 195,65 120,65" fill="url(#dg-b)" opacity="0.9" />
        <polygon points="100,10 120,65 80,65" fill="#e9fbff" opacity="0.85" />
        {/* pavilion */}
        <polygon points="5,65 80,65 100,175" fill="#4a3fd0" opacity="0.95" />
        <polygon points="80,65 120,65 100,175" fill="url(#dg-a)" opacity="0.8" />
        <polygon points="120,65 195,65 100,175" fill="#2a2290" opacity="0.95" />
        <polyline
          points="50,10 150,10 195,65 100,175 5,65 50,10"
          fill="none"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 top-[22%] flex flex-col items-center text-white">
        <span className="text-5xl font-extrabold tabular-nums leading-none sm:text-6xl" style={DISPLAY}>
          {count}
        </span>
        <span className="mt-1 text-xs font-medium text-white/80">olmos</span>
      </div>
    </div>
  );
}

/* ---------- Kichik yordamchilar ---------- */
function Section({
  title,
  icon,
  aside,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] bg-white p-5 ring-1 ring-[#14122b]/8 sm:p-7">
      <header className="mb-5 flex items-center justify-between gap-3">
        <h2
          className="flex items-center gap-2.5 text-xl font-bold text-[#14122b]"
          style={DISPLAY}
        >
          <span className="text-[#6d5bf0]">{icon}</span>
          {title}
        </h2>
        {aside}
      </header>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "ink" | "good" | "bad" | "accent";
}) {
  const color = {
    ink: "text-[#14122b]",
    good: "text-emerald-600",
    bad: "text-rose-600",
    accent: "text-[#6d5bf0]",
  }[tone];
  return (
    <div className="rounded-2xl bg-[#f5f4fa] px-4 py-3">
      <div className={`text-3xl font-extrabold tabular-nums ${color}`} style={DISPLAY}>
        {value}
      </div>
      <div className="mt-0.5 text-xs text-[#14122b]/60">{label}</div>
    </div>
  );
}

function SkillBar({
  label,
  value,
  ready,
  delay,
}: {
  label: string;
  value: number | null;
  ready: boolean;
  delay: number;
}) {
  const pct = value == null ? 0 : Math.min(100, (value / MAX_SKILL) * 100);
  return (
    <div className="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-3 text-sm">
      <span className="text-[#14122b]/65">{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#14122b]/8">
        <div
          className="h-full rounded-full bg-[#6d5bf0] transition-[width] duration-1000 ease-out motion-reduce:transition-none"
          style={{ width: ready ? `${pct}%` : "0%", transitionDelay: `${delay}ms` }}
        />
      </div>
      <span className="text-right font-bold tabular-nums text-[#14122b]">
        {value == null ? "—" : value}
      </span>
    </div>
  );
}

function ExamCard({ a, ready }: { a: ExamAttempt; ready: boolean }) {
  return (
    <article className="rounded-3xl bg-[#f5f4fa] p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-[#14122b]" style={DISPLAY}>
            {a.title}
          </h3>
          <p className="mt-0.5 text-xs text-[#14122b]/55">
            {formatDate(a.finishedAt || a.startedAt)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {a.cefr && (
            <span className={`rounded-lg px-2.5 py-1 text-sm font-extrabold ${cefrColor(a.cefr)}`}>
              {a.cefr}
            </span>
          )}
          <div className="text-right leading-none">
            <div className="text-3xl font-extrabold tabular-nums text-[#14122b]" style={DISPLAY}>
              {a.total ?? "—"}
            </div>
            <div className="mt-1 text-[11px] text-[#14122b]/55">ball</div>
          </div>
        </div>
      </div>
      <div className="space-y-2.5">
        <SkillBar label="Listening" value={a.listening} ready={ready} delay={0} />
        <SkillBar label="Reading" value={a.reading} ready={ready} delay={90} />
        <SkillBar label="Writing" value={a.writing} ready={ready} delay={180} />
        <SkillBar label="Speaking" value={a.speaking} ready={ready} delay={270} />
      </div>
    </article>
  );
}

/* ---------- Asosiy komponent ---------- */
export default function ChildStats({ data }: { data: ChildStatsData }) {
  const { student, attendance, diamonds, payment, exams } = data;
  const cur = payment.currentMonth;
  const paidNow = isPaid(cur.status);
  const levelType =
    typeof student.level === "string" ? student.level : student.level?.type;

  const recent = attendance.recent.slice(0, 30);
  const rate = Math.max(0, Math.min(100, Math.round(attendance.rate)));

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="space-y-5 text-[#14122b]">
      {/* ===== Hero ===== */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#14122b] p-6 text-white sm:p-10">
        {/* nozik yorug'lik */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#6d5bf0]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#8fd9ff]/15 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div className="order-2 text-center md:order-1 md:text-left">
            <p className="text-sm text-white/60">O&apos;quvchi</p>
            <h1
              className="mt-1 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
              style={DISPLAY}
            >
              {student.name}
            </h1>

            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {student.group && (
                <span className="rounded-full bg-white/12 px-3.5 py-1.5 text-sm">
                  {student.group.name}
                </span>
              )}
              {student.group?.schedule && (
                <span className="rounded-full bg-white/12 px-3.5 py-1.5 text-sm">
                  {student.group.schedule}
                </span>
              )}
              {levelType && (
                <span className="rounded-full bg-white/12 px-3.5 py-1.5 text-sm">{levelType}</span>
              )}
              <span
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                  student.isActive ? "bg-emerald-400 text-emerald-950" : "bg-white/25"
                }`}
              >
                {student.isActive ? "Faol" : "Nofaol"}
              </span>
            </div>

            {/* davomat chizig'i */}
            <div className="mt-8 max-w-md md:max-w-sm">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm text-white/65">Davomat</span>
                <span className="text-2xl font-extrabold tabular-nums" style={DISPLAY}>
                  {rate}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#8fd9ff] transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                  style={{ width: ready ? `${rate}%` : "0%" }}
                />
              </div>
              <div className="mt-3 flex justify-center gap-6 text-sm text-white/65 md:justify-start">
                <span>
                  <b className="text-white">{attendance.total}</b> dars
                </span>
                <span>
                  <b className="text-white">{exams.count}</b> imtihon
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <DiamondMark count={diamonds} ready={ready} />
          </div>
        </div>
      </div>

      {/* ===== Davomat ===== */}
      <Section title="Davomat" icon={<CalendarCheck className="h-5 w-5" />}>
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Stat label="Jami dars" value={attendance.total} />
          <Stat label="Keldi" value={attendance.present} tone="good" />
          <Stat label="Kelmadi" value={attendance.absent} tone="bad" />
        </div>

        {recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#14122b]/55">
            Hali davomat belgilanmagan
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-[#14122b]/60">So&apos;nggi {recent.length} ta dars</p>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">
              {recent.map((r, i) => (
                <div
                  key={`${r.date}-${i}`}
                  title={formatDate(r.date)}
                  className={`relative flex flex-col items-center rounded-2xl px-1 py-2.5 text-[11px] font-semibold ${
                    r.present ? "bg-emerald-500 text-white" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {r.present ? (
                    <Check className="mb-1 h-4 w-4" strokeWidth={3} />
                  ) : (
                    <X className="mb-1 h-4 w-4" strokeWidth={3} />
                  )}
                  {formatShort(r.date)}
                  {r.present && r.diamond ? (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#14122b] px-1 text-[10px] font-bold text-[#8fd9ff] ring-2 ring-white">
                      {r.diamond}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#14122b]/50">
              Qora belgi — shu darsda olingan olmoslar soni
            </p>
          </>
        )}
      </Section>

      {/* ===== To'lov ===== */}
      <Section title="Oylik to'lov" icon={<CreditCard className="h-5 w-5" />}>
        {/* joriy oy — chek ko'rinishida */}
        <div
          className={`relative mb-6 overflow-hidden rounded-3xl p-5 sm:p-6 ${
            paidNow ? "bg-emerald-50" : "bg-amber-50"
          }`}
        >
          <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
          <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
          <div className="flex items-center justify-between gap-4 px-2">
            <div>
              <p className="text-sm text-[#14122b]/60">Joriy oy</p>
              <p className="text-2xl font-extrabold" style={DISPLAY}>
                {monthLabel(cur.month)}
              </p>
              {paidNow && (
                <p className="mt-0.5 text-xs text-[#14122b]/55">{formatDate(cur.paidAt)}</p>
              )}
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold text-white ${
                  paidNow ? "bg-emerald-600" : "bg-amber-500"
                }`}
              >
                {paidNow ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                {paidNow ? "To'langan" : "To'lanmagan"}
              </span>
              {cur.amount != null && (
                <p className="mt-2 text-xl font-extrabold tabular-nums" style={DISPLAY}>
                  {formatMoney(cur.amount)}
                </p>
              )}
            </div>
          </div>
        </div>

        {payment.history.length === 0 ? (
          <p className="py-2 text-center text-sm text-[#14122b]/55">To&apos;lovlar tarixi yo&apos;q</p>
        ) : (
          <ul className="divide-y divide-[#14122b]/8">
            {payment.history.map((p) => {
              const ok = isPaid(p.status);
              return (
                <li key={p.id} className="flex items-center gap-4 py-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {ok ? <Check className="h-4 w-4" strokeWidth={3} /> : <Clock className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{monthLabel(p.month)}</p>
                    <p className="text-xs text-[#14122b]/55">
                      {ok ? formatDate(p.paidAt) : "Kutilmoqda"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold tabular-nums">{formatMoney(p.amount)}</p>
                    <p className={`text-xs font-medium ${ok ? "text-emerald-600" : "text-amber-600"}`}>
                      {ok ? "To'langan" : "To'lanmagan"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      {/* ===== Imtihon ===== */}
      <Section title="Imtihon natijalari" icon={<Trophy className="h-5 w-5" />}>
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Stat label="Urinishlar" value={exams.count} />
          <Stat label="Eng yuqori ball" value={exams.bestScore ?? "—"} tone="accent" />
          <Stat label="Oxirgi CEFR" value={exams.lastCefr ?? "—"} tone="accent" />
        </div>

        {exams.attempts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <GraduationCap className="h-8 w-8 text-[#6d5bf0]/60" />
            <p className="text-sm text-[#14122b]/55">Hali imtihon topshirilmagan</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {exams.attempts.map((a) => (
              <ExamCard key={a.id} a={a} ready={ready} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
