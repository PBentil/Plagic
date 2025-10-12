"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, User, Building, CheckSquare } from "lucide-react";
import { getCounts, getLecturers } from "@/app/services/adminDashboard";
import type { ColumnsType } from "antd/es/table";
import Layout from "@/app/components/Layout";
import Table from "@/app/components/table";

interface Lecturer {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: {
        name: string;
    };
    qualification: string;
}

const StatCard = ({
                      title,
                      value,
                      icon,
                      iconBg,
                      iconColor,
                  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}) => (
    <div className="bg-white rounded-lg shadow-sm  p-4 sm:p-6">
        <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className={`text-2xl font-bold truncate ${iconColor}`}>
                    {value.toLocaleString()}
                </p>
            </div>
            <div className={`${iconBg} p-3 rounded-full flex-shrink-0 ml-4`}>
                {icon}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [studentCount, setStudentCount] = useState<number>(0);
    const [lecturerCount, setLecturerCount] = useState<number>(0);
    const [facultyCount, setFacultyCount] = useState<number>(0);
    const [checksCount, setChecksCount] = useState<number>(0);


    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const counts = await getCounts();
                setStudentCount(counts.students);
                setLecturerCount(counts.lecturers);
                setFacultyCount(counts.faculties);
                setChecksCount(counts.checks);

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
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-gray-600 font-medium">Loading...</p>
            </div>
        );
    }

    const lecturerColumns: ColumnsType<Lecturer> = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Department", key: "department", render: (_, record) => record.department?.name || "N/A" },
        { title: "Qualification", dataIndex: "qualification", key: "qualification" },
    ];

    return (
        <Layout>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4  sm:gap-6 mb-6 sm:mb-8">
                <StatCard
                    title="Total Students"
                    value={studentCount}
                    icon={<GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600"/>}
                    iconBg="bg-blue-100" iconColor={"text-blue-600"}             />

                <StatCard
                    title="Total Lecturers"
                    value={lecturerCount}
                    icon={<User className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600"/>}
                    iconBg="bg-purple-100" iconColor={"text-purple-600"}                />

                <StatCard
                    title="Total Faculties"
                    value={facultyCount}
                    icon={<Building className="h-6 w-6 sm:h-8 sm:w-8 text-green-600"/>}
                    iconBg="bg-green-100" iconColor={"text-green-600"}                />

                <StatCard
                    title="Total Checks"
                    value={checksCount}
                    icon={<CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600"/>}
                    iconBg="bg-orange-100" iconColor={"text-orange-600"}                />

            </div>

            <div className="bg-white rounded-lg shadow-sm ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4  space-y-3 sm:space-y-0">
                    <h2 className="text-xl font-semibold text-gray-900">Lecturers</h2>
                    <Link
                        href="/admin/manage-users"
                        className="shadow text-black rounded px-3 py-1 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                        See more
                    </Link>
                </div>
                <div className="p-4">
                    <Table<Lecturer>
                        columns={lecturerColumns}
                        data={lecturers}
                        loading={loading}
                    />
                    {!loading && lecturers.length === 0 && (
                        <p className="text-center text-gray-500 py-6">No lecturers found</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
