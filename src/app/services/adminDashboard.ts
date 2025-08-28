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