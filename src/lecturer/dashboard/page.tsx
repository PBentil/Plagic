"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    ClipboardList,
    FileText,
    AlertCircle,
} from "lucide-react";

import Layout from "@/app/components/Layout";
import Table from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import {
    getMyLecturerCourses,
    getMyLecturerSchedules,
    getScheduleSubmissions
} from "@/app/lecturer/services/lectures.services";


/* ================= TYPES ================= */

interface Course {
    id: number;
    courseCode: string;
    courseName: string;
}

interface Schedule {
    id: number;
    assignmentName: string;
    deadline: string;
    status: string;
    course: Course;
}

interface Submission {
    id: number;
    status: string;
    plagiarismScore?: number;
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
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
            </div>
            <div className={`${iconBg} p-3 rounded-full`}>{icon}</div>
        </div>
    </div>
);

/* ================= DASHBOARD ================= */

export default function LecturerDashboard() {
    const [loading, setLoading] = useState(true);

    const [coursesCount, setCoursesCount] = useState(0);
    const [scheduleCount, setScheduleCount] = useState(0);
    const [submissionCount, setSubmissionCount] = useState(0);
    const [pendingChecks, setPendingChecks] = useState(0);

    const [schedules, setSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        async function loadDashboard() {
            try {
                /* 1️⃣ My courses */
                const courses = await getMyLecturerCourses();
                setCoursesCount(courses.length);

                /* 2️⃣ My schedules */
                const schedules = await getMyLecturerSchedules();
                setSchedules(schedules);
                setScheduleCount(schedules.length);

                /* 3️⃣ Aggregate submissions */
                let allSubmissions: Submission[] = [];

                for (const schedule of schedules) {
                    const subs = await getScheduleSubmissions(schedule.id);
                    allSubmissions = [...allSubmissions, ...subs];
                }

                setSubmissionCount(allSubmissions.length);

                /* 4️⃣ Pending checks */
                setPendingChecks(
                    allSubmissions.filter(s => s.status === "queued").length
                );
            } catch (err) {
                console.error("Lecturer dashboard error:", err);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-gray-600">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    /* ================= TABLE ================= */

    const columns: ColumnsType<Schedule> = [
        {
            title: "Assignment",
            dataIndex: "assignmentName",
            key: "assignmentName",
        },
        {
            title: "Course",
            render: (_, record) => record.course.courseName,
        },
        {
            title: "Deadline",
            render: (_, record) =>
                new Date(record.deadline).toLocaleDateString(),
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Action",
            render: (_, record) => (
                <Link
                    href={`/lecturer/assignments/${record.id}`}
                    className="text-blue-600 hover:underline"
                >
                    View
                </Link>
            ),
        },
    ];

    return (
        <Layout>
            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="My Courses"
                    value={coursesCount}
                    icon={<BookOpen className="h-6 w-6 text-blue-600" />}
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />

                <StatCard
                    title="My Assignments"
                    value={scheduleCount}
                    icon={<ClipboardList className="h-6 w-6 text-purple-600" />}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                />

                <StatCard
                    title="Submissions"
                    value={submissionCount}
                    icon={<FileText className="h-6 w-6 text-green-600" />}
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />

                <StatCard
                    title="Pending Checks"
                    value={pendingChecks}
                    icon={<AlertCircle className="h-6 w-6 text-orange-600" />}
                    iconBg="bg-orange-100"
                    iconColor="text-orange-600"
                />
            </div>

            {/* RECENT ASSIGNMENTS */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-xl font-semibold">Recent Assignments</h2>
                    <Link
                        href="/lecturer/courses"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        View Courses
                    </Link>
                </div>

                <div className="p-4">
                    <Table<Schedule>
                        columns={columns}
                        data={schedules.slice(0, 5)}
                        loading={loading}
                    />

                    {!schedules.length && (
                        <p className="text-center text-gray-500 py-6">
                            No assignments found
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
}
