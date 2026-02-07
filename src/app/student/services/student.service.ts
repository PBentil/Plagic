import { apiFetch } from "@/lib/api";

export function getStudentDashboardStats() {
    return apiFetch("/students/dashboard", {
        method: "GET",
    });
}


export function getMyStudentCourses() {
    return apiFetch("/courses/my-courses", {
        method: "GET",
    });
}

export function enrollInCourse(courseId: number) {
    return apiFetch(`/enrollments/self-enroll/${courseId}`, {
        method: "POST",
    });
}

export function dropCourse(courseId: number) {
    return apiFetch(`/enrollments/drop/${courseId}`, {
        method: "DELETE",
    });
}


export function getMyAssignments() {
    return apiFetch("/schedules/my-schedules", {
        method: "GET",
    });
}

export function submitAssignment(scheduleId: number, formData: FormData) {
    return apiFetch(`/submissions/schedule/${scheduleId}`, {
        method: "POST",
        body: formData,
    });
}

export function getMySubmissions() {
    return apiFetch("/submissions/my-submissions", {
        method: "GET",
    });
}

export function getSubmissionById(id: number) {
    return apiFetch(`/submissions/${id}`, {
        method: "GET",
    });
}
