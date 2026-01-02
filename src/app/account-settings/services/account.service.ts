import { apiFetch } from "@/lib/api";

export function getProfile() {
  return apiFetch("/profile", {
    method: "GET",
  });
}

export function updateProfile(data: { name: string; phone?: string }) {
  return apiFetch("/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
