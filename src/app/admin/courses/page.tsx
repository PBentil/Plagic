"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import CustomTable from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import {
    Modal,
    Form,
    Input,
    message,
    Button,
    Select,
    Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AxiosError } from "axios";
import {
    getCourses,
    addCourse,
    getLecturers,
} from "@/app/services/admin.services";

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

interface Course {
    id: number;
    courseCode: string;
    courseName: string;
    description: string;
    primaryLecturerId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const CoursesPage = () => {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [courses, setCourses] = useState<Course[]>([]);
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);

    const [courseForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [courseList, lecturerList] = await Promise.all([
                getCourses(),
                getLecturers(),
            ]);
            setCourses(courseList);
            setLecturers(lecturerList);
        } catch (error) {
            messageApi.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCourse = async () => {
        try {
            const values = await courseForm.validateFields();
            setIsSubmitting(true);

            await addCourse(values);

            messageApi.success("Course added successfully");
            setIsModalOpen(false);
            courseForm.resetFields();
            fetchData();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const backendMessage =
                axiosErr.response?.data?.message ||
                axiosErr.message ||
                "Failed to add course";
            messageApi.error(backendMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: ColumnsType<Course> = [
        {
            title: "Course Code",
            dataIndex: "courseCode",
            key: "courseCode",
        },
        {
            title: "Course Name",
            dataIndex: "courseName",
            key: "courseName",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Status",
            key: "isActive",
            render: (_, record) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        record.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {record.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
    ];

    return (
        <Layout>
            {contextHolder}

            <div className="flex flex-col bg-gray-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b p-4 gap-3">
                    <div>
                        <h2 className="text-xl text-black font-semibold">
                            Courses
                        </h2>
                        <p className="text-gray-500">
                            Manage courses and assign lecturers
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Course
                    </Button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <CustomTable<Course>
                        columns={columns}
                        data={courses}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Add Course Modal */}
            <Modal
                title="Add Course"
                open={isModalOpen}
                onOk={handleAddCourse}
                confirmLoading={isSubmitting}
                onCancel={() => {
                    setIsModalOpen(false);
                    courseForm.resetFields();
                }}
                okText="Add"
            >
                <Form form={courseForm} layout="vertical">
                    <Form.Item
                        name="courseCode"
                        label="Course Code"
                        rules={[
                            {
                                required: true,
                                message: "Please enter course code",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="courseName"
                        label="Course Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter course name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="primaryLecturerId"
                        label="Lecturer"
                        rules={[
                            {
                                required: true,
                                message: "Please select a lecturer",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Lecturer"
                            showSearch
                            optionFilterProp="label"
                        >
                            {lecturers.map((lecturer) => (
                                <Select.Option
                                    key={lecturer.user.id}
                                    value={lecturer.user.id}
                                    label={lecturer.user.name}
                                >
                                    <Space direction="vertical" size={0}>
                                        <span>{lecturer.user.name}</span>
                                        <span className="text-xs text-gray-400">
                                            {lecturer.department?.name}
                                        </span>
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default CoursesPage;
