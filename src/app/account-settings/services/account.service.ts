import { apiFetch } from "@/lib/api";

export function getProfile() {
  return apiFetch("/account/profile", {
    method: "GET",
  });
}

export function updateProfile(data: { name: string; phone?: string }) {
  return apiFetch("/account/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return apiFetch("/account/change-password", {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}


export function deleteAccount(data: { password: string }) {
  return apiFetch("/account/delete-account", {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
