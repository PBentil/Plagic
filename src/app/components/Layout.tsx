"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { getMenuByRole } from "@/app/utils/getMenuByROLE";

interface User {
    id: string;
    email: string;
    role: string;
}

interface MenuItem {
    key: string;
    label: string;
    path: string;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user: User = JSON.parse(userData);
                setMenuItems(getMenuByRole(user.role));
            } catch (error) {
                console.error("Failed to parse user from localStorage:", error);
            }
        }
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar menuItems={menuItems} />

            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />

                <main
                    className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-6 w-full max-w-7xl mx-auto"
                    style={{ scrollBehavior: "smooth" }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
