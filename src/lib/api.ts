import axios from "axios";
import { API_URL } from "./config";
import { clearSession, getToken } from "./token";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url || "";
    // Token muddati tugagan (1 kun) yoki yaroqsiz -> login sahifasiga
    if (
      status === 401 &&
      !url.includes("/parent/register") &&
      typeof window !== "undefined"
    ) {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

/** Backend xabarini odam o'qiy oladigan matnga aylantiradi */
export function errMsg(err: unknown, fallback = "Xatolik yuz berdi"): string {
  const e = err as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
    code?: string;
  };
  const m = e?.response?.data?.message;
  if (Array.isArray(m)) return m.join(", ");
  if (typeof m === "string" && m) return m;
  if (e?.code === "ERR_NETWORK")
    return "Serverga ulanib bo'lmadi. Internetni tekshiring.";
  return e?.message || fallback;
}
