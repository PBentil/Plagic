"use client";
import React, { useEffect, useState } from "react";

interface User {
    id: string;
    email: string;
    role: string;
}

const Topbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white shadow px-4 sm:px-6 py-3 gap-3">
            {/* Search */}
            <div className="w-full sm:w-1/2">
                <input
                    type="text"
                    placeholder="Search anything here..."
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                />
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
                {user && (
                    <div className="flex flex-col items-center sm:items-end gap-1">
            <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] sm:max-w-xs">
              {user.email}
            </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-semibold">
              {user.role}
            </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Topbar;
