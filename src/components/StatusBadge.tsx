import type { LinkStatus } from "@/types/parent";

const MAP: Record<LinkStatus, { label: string; cls: string }> = {
  PENDING: { label: "Tasdiqlanmoqda", cls: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Tasdiqlangan", cls: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Rad etilgan", cls: "bg-red-100 text-red-700" },
};

export default function StatusBadge({ status }: { status: LinkStatus }) {
  const s = MAP[status] ?? MAP.PENDING;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
