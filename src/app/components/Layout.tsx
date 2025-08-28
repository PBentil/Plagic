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
        <div className="h-screen bg-gray-50 flex">
            <Sidebar menuItems={menuItems} />

            <div className="flex flex-col w-full lg:ml-0">
                <div className="lg:hidden h-16" />
                <Topbar />
                <main className="flex-1 p-4 lg:p-5 mx-auto w-full max-w-7xl">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
