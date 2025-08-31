const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCounts() {
    const res = await fetch(`${API_URL}/admin/stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch counts");
    }

    return res.json();
}

export async function getLecturers() {
    const res = await fetch(`${API_URL}/admin/lecturers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch lecturers");
    }

    return res.json();
}

export async function getStudents() {
    const res = await fetch(`${API_URL}/admin/students`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch students");
    }
    return res.json();
}

export async function addStudent(studentData: {
    name: string;
    email: string;
    phone: string;
    departmentId: number;
}) {
    const res = await fetch(`${API_URL}/admin/add-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
    });

    if (!res.ok) {
        throw new Error("Failed to add student");
    }

    return res.json();
}

export async function addLecturer(lecturerData: {
    name: string;
    email: string;
    phone: string;
    qualification: string;
    departmentId: number;
}) {
    const res = await fetch(`${API_URL}/admin/add-lecturer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lecturerData),
    });

    if (!res.ok) {
        throw new Error("Failed to add lecturer");
    }

    return res.json();
}