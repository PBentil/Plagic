import { apiFetch } from "@/lib/api";

export function getAllArchives() {
  return apiFetch("/archive", {
    method: "GET",
  });
}

export function getArchivesByFaculty(facultyId: number) {
  return apiFetch(`/archive/faculty/${facultyId}`, {
    method: "GET",
  });
}

export function uploadArchive(formData: FormData) {
  return apiFetch("/archive/upload", {
    method: "POST",
    body: formData,
    headers: {},
  });
}
