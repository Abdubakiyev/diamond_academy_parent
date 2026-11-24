import { api } from "./api";
import type {
  AuthResponse,
  ChildLink,
  GroupItem,
  StudentItem,
} from "@/types/parent";
import type { ChildStatsData } from "@/types/stats";

export async function registerOrLogin(body: {
  name: string;
  phone: string;
  password: string;
}) {
  const { data } = await api.post<AuthResponse>("/parent/register", body);
  return data;
}

export async function fetchGroups() {
  const { data } = await api.get<GroupItem[]>("/parent/groups");
  return data;
}

export async function fetchGroupStudents(groupId: number | string) {
  const { data } = await api.get<StudentItem[]>(
    `/parent/groups/${groupId}/students`,
  );
  return data;
}

export async function fetchChildren() {
  const { data } = await api.get<ChildLink[]>("/parent/children");
  return data;
}

export async function requestChild(studentId: number | string) {
  const { data } = await api.post("/parent/children", { studentId });
  return data;
}

export async function removeChild(linkId: number | string) {
  const { data } = await api.delete(`/parent/children/${linkId}`);
  return data;
}

export async function fetchChildStats(studentId: number | string) {
  const { data } = await api.get<ChildStatsData>(
    `/parent/children/${studentId}/stats`,
  );
  return data;
}
