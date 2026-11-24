export interface AttendanceRecent {
  date: string;
  present: boolean;
  diamond?: number | null;
}

export interface PaymentRow {
  id: number | string;
  month: string;
  amount: number | null;
  status: string | null;
  paidAt: string | null;
}

export interface ExamAttempt {
  id: number | string;
  examId: number | string;
  title: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  listening: number | null;
  reading: number | null;
  writing: number | null;
  speaking: number | null;
  total: number | null;
  cefr: string | null;
}

export interface ChildStatsData {
  isStudent: boolean;
  student: {
    id: number | string;
    name: string;
    phone: string | null;
    isActive: boolean;
    group: { id: number | string; name: string; schedule?: string | null } | null;
    level?: { type?: string | null } | string | null;
  };
  attendance: {
    total: number;
    present: number;
    absent: number;
    rate: number;
    recent: AttendanceRecent[];
  };
  diamonds: number;
  payment: {
    currentMonth: {
      month: string;
      status: string | null;
      amount: number | null;
      paidAt: string | null;
    };
    history: PaymentRow[];
  };
  exams: {
    count: number;
    bestScore: number | null;
    lastCefr: string | null;
    attempts: ExamAttempt[];
  };
}
