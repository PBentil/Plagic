"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardList, FileCheck, AlertCircle } from "lucide-react";
import Layout from "@/app/components/Layout";
import Table from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import {getMyLecturerCourses, getMyLecturerSchedules} from "@/app/lecturer/services/lectures.services";


interface Course {
    id: number;
    courseCode: string;
    courseName: string;
    description: string;
    isActive: boolean;
}

interface Schedule {
    id: number;
    title: string;
    dueDate: string;
    isPublished: boolean;
    course: {
        id: number;
        courseName: string;
    };
}

/* ================= STAT CARD ================= */
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
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
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

/* ================= DASHBOARD ================= */
const LecturerDashboard = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [coursesData, schedulesData] = await Promise.all([
                    getMyLecturerCourses(),
                    getMyLecturerSchedules(),
                ]);

                setCourses(coursesData);
                setSchedules(schedulesData);
            } catch (error) {
                console.error("Lecturer dashboard error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    /* ================= TABLE ================= */
    const scheduleColumns: ColumnsType<Schedule> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Course",
            key: "course",
            render: (_, record) => record.course?.courseName || "N/A",
        },
        {
            title: "Due Date",
            key: "dueDate",
            render: (_, record) =>
                new Date(record.dueDate).toLocaleDateString(),
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) =>
                record.isPublished ? (
                    <span className="text-green-600 font-medium">Published</span>
                ) : (
                    <span className="text-orange-600 font-medium">Draft</span>
                ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <Layout>
            {/* ================= STATS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <StatCard
                    title="My Courses"
                    value={courses.length}
                    icon={<BookOpen className="h-7 w-7 text-blue-600" />}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />

                <StatCard
                    title="My Schedules"
                    value={schedules.length}
                    icon={<ClipboardList className="h-7 w-7 text-purple-600" />}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                />

                <StatCard
                    title="Published"
                    value={schedules.filter(s => s.isPublished).length}
                    icon={<FileCheck className="h-7 w-7 text-green-600" />}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />

                <StatCard
                    title="Drafts"
                    value={schedules.filter(s => !s.isPublished).length}
                    icon={<AlertCircle className="h-7 w-7 text-orange-600" />}
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                />
            </div>

            {/* ================= SCHEDULE TABLE ================= */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        My Schedules
                    </h2>
                    <Link
                        href="/lecturer/schedules"
                        className="text-sm font-medium hover:underline"
                    >
                        See all
                    </Link>
                </div>

                <div className="p-4">
                    <Table<Schedule>
                        columns={scheduleColumns}
                        data={schedules}
                        loading={loading}
                    />
                    {!loading && schedules.length === 0 && (
                        <p className="text-center text-gray-500 py-6">
                            No schedules created yet
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default LecturerDashboard;
