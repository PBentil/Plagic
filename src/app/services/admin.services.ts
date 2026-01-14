import { apiFetch } from "@/lib/api";

export function getCounts() {
  return apiFetch("/admin/stats", {
    method: "GET",
  });
}

export function getLecturers() {
  return apiFetch("/admin/lecturers", {
    method: "GET",
  });
}

export function getStudents() {
  return apiFetch("/admin/students", {
    method: "GET",
  });
}

export function addStudent(studentData: {
  name: string;
  email: string;
  phone: string;
  departmentId: number;
}) {
  return apiFetch("/admin/add-student", {
    method: "POST",
    body: JSON.stringify(studentData),
  });
}

export function addLecturer(lecturerData: {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  departmentId: number;
}) {
  return apiFetch("/admin/add-lecturer", {
    method: "POST",
    body: JSON.stringify(lecturerData),
  });
}

export function getFaculties() {
  return apiFetch("/admin/faculties", {
    method: "GET",
  });
}

export function addFaculty(data: { name: string }) {
  return apiFetch("/admin/add-faculties", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateFaculty(
  facultyId: number,
  data: { name: string }
) {
  return apiFetch(`/admin/faculty/${facultyId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteFaculty(facultyId: number) {
  return apiFetch(`/admin/faculty/${facultyId}`, {
    method: "DELETE",
  });
}

export function addDepartment(data: {
  name: string;
  facultyId: number;
}) {
  return apiFetch("/admin/add-department", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateDepartment(
  departmentId: number,
  data: { name: string; facultyId: number }
) {
  return apiFetch(`/admin/department/${departmentId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteDepartment(departmentId: number) {
  return apiFetch(`/admin/department/${departmentId}`, {
    method: "DELETE",
  });
}

export function getDepartments() {
  return apiFetch("/admin/departments", {
    method: "GET",
  });
}
