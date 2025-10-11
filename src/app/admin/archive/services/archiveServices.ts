const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 📂 Get all archives
export const getAllArchives = async () => {
    try {
        const response = await fetch(`${API_URL}/archive`);
        if (!response.ok) throw new Error("Failed to fetch archives");
        return await response.json();
    } catch (error) {
        console.error("Error fetching archives:", error);
        throw error;
    }
};

// 🎓 Get archives by faculty ID
export const getArchivesByFaculty = async (facultyId: number) => {
    try {
        const response = await fetch(`${API_URL}/archive/faculty/${facultyId}`);
        if (!response.ok) throw new Error("Failed to fetch faculty archives");
        return await response.json();
    } catch (error) {
        console.error("Error fetching archives by faculty:", error);
        throw error;
    }
};

// 📤 Upload new archive (PDF only)
export const uploadArchive = async (formData: FormData) => {
    try {
        const response = await fetch(`${API_URL}/archive/upload`, {
            method: "POST",
            body: formData, // form-data includes file, facultyId, title, description
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error uploading archive:", error);
        throw error;
    }
};
