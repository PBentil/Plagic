"use client";

import { useEffect, useState } from "react";
import { message, Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Layout from "@/app/components/Layout";
import { getMyStudentCourses, dropCourse } from "@/app/student/services/student.service";

interface Course {
    id: number;
    courseCode: string;
    courseName: string;
    description?: string;
}

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const data = await getMyStudentCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
            message.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleDrop = async (id: number) => {
        try {
            await dropCourse(id);
            message.success("Dropped course successfully");
            loadCourses();
        } catch (err) {
            console.error(err);
            message.error("Failed to drop course");
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
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        onClick={() => window.location.href = `/student/courses/${record.id}/assignments`}
                    >
                        Assignments
                    </Button>
                    <Button danger onClick={() => handleDrop(record.id)}>
                        Drop
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h1 className="text-2xl font-semibold mb-6">My Courses</h1>

            <Table
                columns={columns}
                dataSource={courses}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
        </Layout>
    );
}
