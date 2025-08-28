"use client";
import React, { useEffect, useState } from "react";
import {getLecturers, getStudents} from "@/app/services/adminDashboard";
import { Spin } from "antd";
import Layout from "@/app/components/Layout";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import CustomTable from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import { FaPlus } from "react-icons/fa6";

interface Lecturer {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    qualification: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
}

const ManageUsers = () => {
    const [loading, setLoading] = useState(true);
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [activeTab, setActiveTab] = useState<"lecturers" | "students">(
        "lecturers"
    );

    useEffect(() => {
        async function fetchData() {
            try {
                const lecturerList = await getLecturers();
                setLecturers(lecturerList);
                const studentsList = await getStudents();
                setStudents(studentsList);
            } catch (error) {
                console.error("Error fetching data:", error);
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
                    Loading users...
                </p>
            </div>
        );
    }
    const lecturerColumns: ColumnsType<Lecturer> = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Department", dataIndex: "department", key: "department" },
        { title: "Qualification", dataIndex: "qualification", key: "qualification" },
    ];

    const studentColumns: ColumnsType<Student> = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Department", dataIndex: "department", key: "department" },
    ];

    return (
        <Layout>
            <div className="flex flex-col  bg-gray-50 ">
                <div className="flex items-center justify-between mb-6 ">
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                activeTab === "lecturers"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setActiveTab("lecturers")}
                        >
                            Lecturers
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                activeTab === "students"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setActiveTab("students")}
                        >
                            Students
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 flex items-center gap-2">
                            Filter by <CiFilter />
                        </button>
                        <button className="px-4 py-2 text-black bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                            Bulk upload <IoCloudUploadOutline />
                        </button>
                        {activeTab === "lecturers" && (
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                Add Lecturer <FaPlus />
                            </button>
                        )}
                        {activeTab === "students" && (
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                Add Student <FaPlus />
                            </button>
                        )}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    {activeTab === "lecturers" ? (
                        <CustomTable<Lecturer>
                            columns={lecturerColumns}
                            data={lecturers}
                            loading={loading}
                        />
                    ) : (
                        <CustomTable<Student>
                            columns={studentColumns}
                            data={students}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ManageUsers;
