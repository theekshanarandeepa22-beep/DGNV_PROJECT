import { jwtDecode } from "jwt-decode";
import type { Role } from "../types/platform";

type TokenClaims = {
  sub?: string;
  role?: Role;
};

export const getToken = () => localStorage.getItem("token") || "";

export const getRole = (): Role | "" => {
  const role = localStorage.getItem("role");
  return role === "ADMIN" || role === "OFFICER" || role === "CITIZEN"
    ? role
    : "";
};

export const getEmail = () => {
  const savedEmail = localStorage.getItem("email");

  if (savedEmail) {
    return savedEmail;
  }

  const token = getToken();

  if (!token) {
    return "";
  }

  try {
    return jwtDecode<TokenClaims>(token).sub || "";
  } catch {
    return "";
  }
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
};
