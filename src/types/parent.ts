export type LinkStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ParentUser {
  id: number | string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: ParentUser;
  redirect?: string;
}

export interface GroupItem {
  id: number | string;
  name: string;
  schedule?: string | null;
  level?: { type?: string | null } | null;
  _count?: { students: number };
}

export interface StudentItem {
  id: number | string;
  name: string;
}

export interface ChildLink {
  id: number | string;
  status: LinkStatus;
  createdAt: string;
  student: {
    id: number | string;
    name: string;
    group?: { id: number | string; name: string } | null;
  };
}
