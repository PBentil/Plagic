const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CheckResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export async function checkText(text: string): Promise<CheckResponse> {
    try {
        const res = await fetch(`${BASE_URL}/checker/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error("Failed to check text");
        return await res.json();
    } catch (err: any) {
        console.error("Error:", err);
        return { success: false, message: err.message };
    }
}

export async function checkFile(file: File): Promise<CheckResponse> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${BASE_URL}/checker/check?`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Failed to check file");
        return await res.json();
    } catch (err: any) {
        console.error("Error:", err);
        return { success: false, message: err.message };
    }
}
