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

export async function getFaculties() {
    const res = await fetch(`${API_URL}/admin/faculties`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch faculties");
    }
    return res.json();
}

export async function addFaculty(lecturerData: {
    name: string;
}) {
    const res = await fetch(`${API_URL}/admin/add-faculties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lecturerData),
    });

    if (!res.ok) {
        throw new Error("Failed to add faculty");
    }

    return res.json();
}

export async function updateFaculty(facultyId: number, facultyData: { name: string }) {
    const res = await fetch(`${API_URL}/admin/faculty/${facultyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facultyData),
    });

    if (!res.ok) {
        throw new Error("Failed to update faculty");
    }

    return res.json();
}

export async function deleteFaculty(facultyId: number) {
    const res = await fetch(`${API_URL}/admin/faculty/${facultyId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete faculty");
    }

    return res.json();
}

export async function addDepartment(departmentData: {
    name: string;
    facultyId: number;
}) {
    const res = await fetch(`${API_URL}/admin/add-department`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departmentData),
    });
    if (!res.ok) {
        throw new Error("Failed to add department");
    }
    return res.json();
}

export async function updateDepartment(
    departmentId: number,
    departmentData: { name: string; facultyId: number }
) {
    const res = await fetch(`${API_URL}/admin/department/${departmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departmentData),
    });

    if (!res.ok) {
        throw new Error("Failed to update department");
    }

    return res.json();
}

export async function deleteDepartment(departmentId: number) {
    const res = await fetch(`${API_URL}/admin/department/${departmentId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete department");
    }

    return res.json();
}
