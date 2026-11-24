export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

export const TOKEN_KEY = "parent_token";
export const USER_KEY = "parent_user";
