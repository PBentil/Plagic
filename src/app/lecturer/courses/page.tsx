"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, Popconfirm } from "antd";
import Table from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import Layout from "@/app/components/Layout";
import {addCourse, deleteCourse, getMyLecturerCourses, updateCourse} from "@/app/lecturer/services/lectures.services";



interface Course {
    id: number;
    courseCode: string;
    courseName: string;
    description?: string;
}


export default function LecturerCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();


    const loadCourses = async () => {
        setLoading(true);
        try {
            const data = await getMyLecturerCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            if (editingCourse) {
                await updateCourse(editingCourse.id, values);
                messageApi.success("Course updated successfully");
            } else {
                await addCourse(values);
                messageApi.success("Course created successfully");
            }
            setModalVisible(false);
            setEditingCourse(null);
            form.resetFields();
            loadCourses();
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to save course");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCourse(id);
            messageApi.success("Course deleted successfully");
            loadCourses();
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to delete course");
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
            render: (text) => text || "-",
        },
        {
            title: "Actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="link"
                        onClick={() => {
                            setEditingCourse(record);
                            form.setFieldsValue(record);
                            setModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this course?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                    <Button type="link" href={`/lecturer/courses/${record.id}/assignments`}>
                        Assignments
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            {contextHolder}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl text-black font-semibold">My Courses</h1>
                <Button type="primary" onClick={() => setModalVisible(true)}>
                    + New Course
                </Button>
            </div>

            <Table<Course>
                columns={columns}
                data={courses}
                loading={loading}
            />

            <Modal
                title={editingCourse ? "Edit Course" : "New Course"}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingCourse(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={editingCourse || {}}
                >
                    <Form.Item
                        label="Course Code"
                        name="courseCode"
                        rules={[{ required: true, message: "Enter course code" }]}
                    >
                        <Input placeholder="CS101" />
                    </Form.Item>

                    <Form.Item
                        label="Course Name"
                        name="courseName"
                        rules={[{ required: true, message: "Enter course name" }]}
                    >
                        <Input placeholder="Introduction to Computer Science" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input.TextArea placeholder="Optional description" rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}
