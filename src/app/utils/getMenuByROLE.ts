import { adminMenu, lecturerMenu, studentMenu } from "./menuRoutes";

export function getMenuByRole(role: string) {
    switch (role) {
        case "ADMIN":
            return adminMenu;
        case "LECTURER":
            return lecturerMenu;
        case "STUDENT":
            return studentMenu;
        default:
            return [];
    }
}
