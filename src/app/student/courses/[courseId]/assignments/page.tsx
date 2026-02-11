"use client";

import { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import {enrollInCourse, getAllCourses} from "@/app/student/services/student.service";


interface Course {
    id: number;
    title: string;
    code: string;
    description: string;
}

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [enrollingId, setEnrollingId] = useState<number | null>(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getAllCourses();
            setCourses(data);
        } catch (error: any) {
            message.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    const enrollCourse = async (courseId: number) => {
        try {
            setEnrollingId(courseId);
            await enrollInCourse(courseId);

            message.success("Successfully enrolled!");

            // refresh courses after enroll
            fetchCourses();
        } catch (error: any) {
            message.error(error?.message || "Enrollment failed");
        } finally {
            setEnrollingId(null);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const columns: ColumnsType<Course> = [
        {
            title: "Course Code",
            dataIndex: "code",
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Action",
            render: (_, record) => (
                <Button
                    type="primary"
                    loading={enrollingId === record.id}
                    onClick={() => enrollCourse(record.id)}
                >
                    Enroll
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>Available Courses</h2>

            {loading ? (
                <Spin />
            ) : (
                <Table
                    columns={columns}
                    dataSource={courses}
                    rowKey="id"
                />
            )}
        </div>
    );
}
