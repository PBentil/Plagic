"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaListCheck } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import { HiMenu, HiX } from "react-icons/hi";
import { adminMenu, lecturerMenu, studentMenu } from "@/app/utils/menuRoutes";
import { logoutUser } from "../services/auth";
import { message } from "antd";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      switch (user.role) {
        case "ADMIN":
          setMenuItems(adminMenu);
          break;
        case "LECTURER":
          setMenuItems(lecturerMenu);
          break;
        case "STUDENT":
          setMenuItems(studentMenu);
          break;
        default:
          setMenuItems([]);
      }
    } catch (err) {
      console.error("Error parsing user from localStorage", err);
      setMenuItems([]);
    }
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      message.success("Logged out successfully");
      setTimeout(() => (window.location.href = "/"), 500);
    } catch (err) {
      console.error("Logout failed", err);
      message.error("Logout failed. Try again.");
    }
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 sm:w-80 lg:w-72 xl:w-80
          h-screen bg-gray-300 text-black p-4 
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center text-primary gap-2 mb-6 px-4">
            <FaListCheck className="text-[#0267FF] text-2xl flex-shrink-0" />
            <h2 className="text-xl font-semibold truncate">PLAGICHECKER</h2>
          </div>

          {/* Menu */}
          <nav className="flex-1">
            <ul className="space-y-2 lg:space-y-4">
              {menuItems.length > 0 ? (
                menuItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 lg:py-2 rounded-xl transition-colors group
                          ${
                            isActive
                              ? "bg-[#0267FF] text-white shadow-md"
                              : "hover:bg-[#0267FF] hover:text-white"
                          }`}
                      >
                        <span
                          className={`text-xl flex-shrink-0 transition-transform ${
                            isActive ? "scale-110" : "group-hover:scale-105"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 text-gray-500 text-sm">No menu available</li>
              )}
            </ul>
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-6 px-4 border-t border-gray-400 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 lg:py-2 rounded-xl text-red-600 hover:text-white hover:bg-red-800 transition-colors group w-full"
          >
            <TbLogout2 className="text-2xl flex-shrink-0" />
            <span className="font-medium truncate">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
