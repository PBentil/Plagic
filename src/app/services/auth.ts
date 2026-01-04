import { apiFetch } from "@/lib/api";

export function loginUser(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    auth: true, 
    body: JSON.stringify({ email, password }),
  });
}

export function forgotPassword(email: string) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    auth: false, 
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(payload: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function logoutUser() {
  return apiFetch("/auth/logout", {
    method: "POST",
    auth: true,
  });
}