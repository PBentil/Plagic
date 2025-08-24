const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    return res.json();
}

// FORGOT PASSWORD
export async function forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        throw new Error("Failed to send reset link");
    }

    return res.json();
}

// RESET PASSWORD
export async function resetPassword(token: string, password: string) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
    });

    if (!res.ok) {
        throw new Error("Password reset failed");
    }

    return res.json();
}
