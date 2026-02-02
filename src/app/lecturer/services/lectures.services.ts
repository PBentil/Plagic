import { apiFetch } from "@/lib/api";

export function getMyLecturerCourses() {
    return apiFetch("/courses/my-courses", {
        method: "GET",
    });
}

export function getMyLecturerSchedules() {
    return apiFetch("/schedules/my-schedules", {
        method: "GET",
    });
}

export function getCourseStats(courseId: number) {
    return apiFetch(`/courses/${courseId}/stats`, {
        method: "GET",
    });
}

export function getScheduleSubmissions(scheduleId: number) {
    return apiFetch(`/submissions/schedule/${scheduleId}`, {
        method: "GET",
    });
}
