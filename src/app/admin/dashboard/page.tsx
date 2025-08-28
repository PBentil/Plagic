"use client";
import React, { useEffect, useState } from "react";
import { Users, GraduationCap, Mail, Phone } from "lucide-react";
import { getCounts, getLecturers } from "@/app/services/adminDashboard";
import { Spin } from "antd";
import Layout from "@/app/components/Layout";

interface Lecturer {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    qualification: string;
}

const Dashboard = () => {
    const [studentCount, setStudentCount] = useState<number>(0);
    const [lecturerCount, setLecturerCount] = useState<number>(0);
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const counts = await getCounts();
                setStudentCount(counts.students);
                setLecturerCount(counts.lecturers);

                const lecturerList = await getLecturers();
                setLecturers(lecturerList);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
                <Spin size="large" />
                <p className="mt-4 text-lg font-semibold animate-pulse">
                    Loading dashboard data...
                </p>
            </div>
        );
    }

    return (
        <Layout>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Total Students
                            </p>
                            <p className="text-2xl font-bold text-blue-600 truncate">
                                {studentCount.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full flex-shrink-0 ml-4">
                            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Total Lecturers
                            </p>
                            <p className="text-2xl font-bold text-purple-600 truncate">
                                {lecturerCount}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full flex-shrink-0 ml-4">
                            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lecturers Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b space-y-3 sm:space-y-0">
                    <h2 className="text-xl font-semibold text-gray-900">Lecturers</h2>
                    <button className="shadow text-black rounded px-3 py-1 hover:bg-gray-50 transition-colors text-sm sm:text-base">
                        See more
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead className="bg-gray-50 hidden sm:table-header-group">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qualification
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {lecturers.map((lecturer) => (
                            <tr key={lecturer.id} className="hover:bg-gray-50">
                                <td className="sm:hidden px-4 py-4">
                                    <div className="space-y-2">
                                        <div className="font-medium text-gray-900">
                                            {lecturer.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">{lecturer.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4 flex-shrink-0" />
                                            <span>{lecturer.phone}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Dept:</span>{" "}
                                            {lecturer.department}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Qual:</span>{" "}
                                            {lecturer.qualification}
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {lecturer.name}
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <span className="truncate">{lecturer.email}</span>
                                    </div>
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <span>{lecturer.phone}</span>
                                    </div>
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-900">
                                    <span className="truncate">{lecturer.department}</span>
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-900">
                                    <span className="truncate">{lecturer.qualification}</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
