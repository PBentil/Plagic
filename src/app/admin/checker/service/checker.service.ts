import { apiFetch } from "@/lib/api";

export interface CheckResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export function checkText(text: string): Promise<CheckResponse> {
  return apiFetch("/checker/check", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function checkFile(file: File): Promise<CheckResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch("/checker/check", {
    method: "POST",
    body: formData,
    headers: {}, 
  });
}
