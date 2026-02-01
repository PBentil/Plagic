"use client";
import React, { useEffect, useState } from "react";
import {getLecturers, getStudents, addLecturer, addStudent, getDepartments} from "@/app/services/admin.services";
import Layout from "@/app/components/Layout";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import CustomTable from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import { FaPlus } from "react-icons/fa6";
import { Modal, Form, Input, Select, message } from "antd";
import { AxiosError } from "axios";

interface Lecturer {
    id: number;
    qualification: string;
    department: {
        id: number;
        name: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
}

interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: { id: number; name: string };
}

const ManageUsers = () => {
    const [loading, setLoading] = useState(true);
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [activeTab, setActiveTab] = useState<"lecturers" | "students">("lecturers");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);


    async function fetchData() {
        setLoading(true);
        try {
            const lecturerList = await getLecturers();
            setLecturers(lecturerList);

            const studentsList = await getStudents();
            // Map the API response to match our Student interface
            const mappedStudents = studentsList.map((s: any) => ({
                id: s.id.toString(),
                name: s.user.name,
                email: s.user.email,
                phone: s.user.phone,
                department: s.department,
            }));
            setStudents(mappedStudents);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchDepartments() {
        try {
            const depts = await getDepartments();
            setDepartments(depts);
        } catch (err) {
            console.error("Error fetching departments:", err);
        }
    }

    useEffect(() => {
        fetchData();
        fetchDepartments();
    }, []);

    const lecturerColumns: ColumnsType<Lecturer> = [
        {
            title: "Name",
            key: "name",
            render: (_, record) => record.user?.name || "N/A",
        },
        {
            title: "Email",
            key: "email",
            render: (_, record) => record.user?.email || "N/A",
        },
        {
            title: "Phone",
            key: "phone",
            render: (_, record) => record.user?.phone || "N/A",
        },
        {
            title: "Department",
            key: "department",
            render: (_, record) => record.department?.name || "N/A",
        },
        {
            title: "Qualification",
            dataIndex: "qualification",
            key: "qualification",
        },
    ];


    const studentColumns: ColumnsType<Student> = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Department", key: "department", render: (_, record) => record.department?.name || "N/A" },
    ];

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setIsSubmitting(true);

            if (activeTab === "lecturers") {
                const payload = {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    qualification: values.qualification,
                    departmentId: values.departmentId,
                };
                await addLecturer(payload);
                messageApi.success("Lecturer added successfully");
            } else {
                const payload = {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    departmentId: values.departmentId,
                };
                await addStudent(payload);
                messageApi.success("Student added successfully");
            }

            setIsModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const backendMessage =
                axiosErr.response?.data?.message ||
                axiosErr.message ||
                "Failed to add user or user already exists";

            messageApi.error(backendMessage);
            setIsModalOpen(false);
            form.resetFields();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            {contextHolder}
            <div className="flex flex-col bg-gray-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                activeTab === "lecturers" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setActiveTab("lecturers")}
                        >
                            Lecturers
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                activeTab === "students" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setActiveTab("students")}
                        >
                            Students
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 flex items-center gap-2">
                            Filter by <CiFilter />
                        </button>
                        <button className="px-4 py-2 text-black bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                            Bulk upload <IoCloudUploadOutline />
                        </button>
                        {activeTab === "lecturers" && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                Add Lecturer <FaPlus />
                            </button>
                        )}
                        {activeTab === "students" && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                Add Student <FaPlus />
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    {activeTab === "lecturers" ? (
                        <CustomTable<Lecturer> columns={lecturerColumns} data={lecturers} loading={loading} />
                    ) : (
                        <CustomTable<Student> columns={studentColumns} data={students} loading={loading} />
                    )}
                </div>
            </div>

            <Modal
                title={activeTab === "lecturers" ? "Add Lecturer" : "Add Student"}
                open={isModalOpen}
                onOk={handleOk}
                confirmLoading={isSubmitting}
                onCancel={() => setIsModalOpen(false)}
                okText="Add"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter name" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    {activeTab === "lecturers" && (
                        <Form.Item name="qualification" label="Qualification" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    )}
                    <Form.Item name="departmentId" label="Department" rules={[{ required: true }]}>
                        <Select placeholder="Select department">
                            {departments.map((dept) => (
                                <Select.Option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
        </Layout>
    );
};

export default ManageUsers;
