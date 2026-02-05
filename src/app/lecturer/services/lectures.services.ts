import { apiFetch } from "@/lib/api";


export function getMyLecturerCourses() {
    return apiFetch("/courses/my-courses", {
        method: "GET",
    });
}

export function addCourse(data: {
    courseCode: string;
    courseName: string;
    description?: string;
    primaryLecturerId?: string;
}) {
    return apiFetch("/courses", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function updateCourse(
    courseId: number,
    data: {
        courseCode?: string;
        courseName?: string;
        description?: string;
        primaryLecturerId?: string;
    }
) {
    return apiFetch(`/courses/${courseId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export function deleteCourse(courseId: number) {
    return apiFetch(`/courses/${courseId}`, {
        method: "DELETE",
    });
}

export function getCourseStats(courseId: number) {
    return apiFetch(`/courses/${courseId}/stats`, {
        method: "GET",
    });
}

export function getCourseStudents(courseId: number) {
    return apiFetch(`/courses/${courseId}/students`, {
        method: "GET",
    });
}


export function getMyLecturerSchedules() {
    return apiFetch("/schedules/my-schedules", {
        method: "GET",
    });
}

export function addSchedule(data: {
    courseId: number;
    assignmentName: string;
    assignmentDescription?: string;
    deadline: string;
    lateSubmissionAllowed: boolean;
    allowedFileFormats: string[];
    maxFileSizeMb: number;
    maxSubmissionsAllowed: number;
    autoCheckEnabled: boolean;
    similarityThresholdPercentage: number;
    selfCheckEnabled: boolean;
    maxSelfCheckAttempts: number;
}) {
    return apiFetch("/schedules", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function publishSchedule(scheduleId: number) {
    return apiFetch(`/schedules/${scheduleId}/publish`, {
        method: "POST",
    });
}

export function updateSchedule(
    scheduleId: number,
    data: any
) {
    return apiFetch(`/schedules/${scheduleId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export function deleteSchedule(scheduleId: number) {
    return apiFetch(`/schedules/${scheduleId}`, {
        method: "DELETE",
    });
}

export function getScheduleSubmissions(scheduleId: number) {
    return apiFetch(`/submissions/schedule/${scheduleId}`, {
        method: "GET",
    });
}

export function getSubmission(submissionId: number) {
    return apiFetch(`/submissions/${submissionId}`, {
        method: "GET",
    });
}

export function triggerPlagiarismCheck(submissionId: number) {
    return apiFetch(`/submissions/${submissionId}/check`, {
        method: "POST",
    });
}
