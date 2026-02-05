import { apiFetch } from "@/lib/api";

/* ============================
   COURSES
============================ */

// Lecturer/Admin: get own courses
export function getMyLecturerCourses() {
    return apiFetch("/courses/my-courses", {
        method: "GET",
    });
}

// Lecturer/Admin: create course
export function addCourse(data: {
    courseCode: string;
    courseName: string;
    description?: string;
    primaryLecturerId?: string; // optional for admin
}) {
    return apiFetch("/courses", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Lecturer/Admin: update course
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

// Lecturer/Admin: delete course
export function deleteCourse(courseId: number) {
    return apiFetch(`/courses/${courseId}`, {
        method: "DELETE",
    });
}

// Lecturer/Admin: course statistics
export function getCourseStats(courseId: number) {
    return apiFetch(`/courses/${courseId}/stats`, {
        method: "GET",
    });
}

// Lecturer/Admin: students enrolled in a course
export function getCourseStudents(courseId: number) {
    return apiFetch(`/courses/${courseId}/students`, {
        method: "GET",
    });
}

/* ============================
   SCHEDULES (ASSIGNMENTS)
============================ */

// Lecturer/Admin: get own schedules
export function getMyLecturerSchedules() {
    return apiFetch("/schedules/my-schedules", {
        method: "GET",
    });
}

// Lecturer/Admin: create schedule
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

// Lecturer/Admin: publish schedule
export function publishSchedule(scheduleId: number) {
    return apiFetch(`/schedules/${scheduleId}/publish`, {
        method: "POST",
    });
}

// Lecturer/Admin: update schedule
export function updateSchedule(
    scheduleId: number,
    data: any
) {
    return apiFetch(`/schedules/${scheduleId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Lecturer/Admin: delete schedule
export function deleteSchedule(scheduleId: number) {
    return apiFetch(`/schedules/${scheduleId}`, {
        method: "DELETE",
    });
}

/* ============================
   SUBMISSIONS
============================ */

// Lecturer/Admin: get submissions for a schedule
export function getScheduleSubmissions(scheduleId: number) {
    return apiFetch(`/submissions/schedule/${scheduleId}`, {
        method: "GET",
    });
}

// Lecturer/Admin: view a single submission
export function getSubmission(submissionId: number) {
    return apiFetch(`/submissions/${submissionId}`, {
        method: "GET",
    });
}

// Lecturer/Admin: manually trigger plagiarism check
export function triggerPlagiarismCheck(submissionId: number) {
    return apiFetch(`/submissions/${submissionId}/check`, {
        method: "POST",
    });
}
