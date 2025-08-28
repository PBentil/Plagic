const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error( "Login failed");
    }

    return res.json();
}

export async function forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        throw new Error("Reset link failed");
    }

    return res.json();
}

export async function resetPassword(payload: {
    token: string;
    newPassword: string;
    confirmPassword: string;
}) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Password reset failed");
    }

    return res.json();
}
