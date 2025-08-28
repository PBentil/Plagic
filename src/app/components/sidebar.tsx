import React, { useState } from "react";
import Link from "next/link";
import { FaListCheck } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import { HiMenu, HiX } from "react-icons/hi";

interface MenuItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

interface SidebarProps {
    menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <HiX className="w-6 h-6" />
                ) : (
                    <HiMenu className="w-6 h-6" />
                )}
            </button>

            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
                    onClick={toggleMobileMenu}
                />
            )}

            <div
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-72 sm:w-80 lg:w-72 xl:w-80
                    h-screen bg-gray-300 text-black p-4 
                    flex flex-col justify-between
                    transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div>
                    <div className="flex items-center text-primary space-y-4 p-4 gap-2 mb-6 px-4">
                        <FaListCheck className="text-[#0267FF] text-2xl mb-0.5 flex-shrink-0" />
                        <h2 className="text-xl font-semibold truncate">PLAGICHECKER</h2>
                    </div>

                    <nav className="flex-1">
                        <ul className="space-y-2 lg:space-y-4">
                            {menuItems.map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 lg:py-2 rounded-xl hover:bg-[#0267FF] hover:text-white transition-colors group"
                                    >
                                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                                        <span className="truncate">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="mt-6 px-4 border-t border-gray-400 pt-4">
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 lg:py-2 rounded-xl text-red-600 hover:text-white hover:bg-red-800 transition-colors group w-full"
                    >
                        <TbLogout2 className="text-2xl flex-shrink-0" />
                        <span className="font-medium truncate">Logout</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Sidebar;