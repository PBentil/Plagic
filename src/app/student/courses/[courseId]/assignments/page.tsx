"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table, Button, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import Layout from "@/app/components/Layout";
import { getMyAssignments, submitAssignment } from "@/app/student/services/student.service";

interface Assignment {
    id: number;
    assignmentName: string;
    deadline: string;
    status?: string;
    course: {
        id: number;
        courseName: string;
    };
}

export default function StudentCourseAssignmentsPage() {
    const { courseId } = useParams();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<number | null>(null);

    const loadAssignments = async () => {
        setLoading(true);
        try {
            const data = await getMyAssignments();
            const filtered = data.filter((a: Assignment) => a.course.id === Number(courseId));
            setAssignments(filtered);
        } catch (err) {
            console.error(err);
            message.error("Failed to load assignments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssignments();
    }, [courseId]);

    const handleSubmit = async (assignmentId: number) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";

        fileInput.onchange = async () => {
            if (!fileInput.files?.length) return;

            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append("file", file);

            try {
                setSubmittingId(assignmentId);
                await submitAssignment(assignmentId, formData);
                message.success("Assignment submitted successfully");
                loadAssignments();
            } catch (err) {
                console.error(err);
                message.error("Failed to submit assignment");
            } finally {
                setSubmittingId(null);
            }
        };

        fileInput.click();
    };

    const columns: ColumnsType<Assignment> = [
        {
            title: "Assignment Name",
            dataIndex: "assignmentName",
            key: "assignmentName",
        },
        {
            title: "Deadline",
            dataIndex: "deadline",
            key: "deadline",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text) => text || "Pending",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    loading={submittingId === record.id}
                    onClick={() => handleSubmit(record.id)}
                >
                    Submit
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <h1 className="text-2xl font-semibold mb-6">Assignments</h1>

            <Table
                columns={columns}
                dataSource={assignments}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
        </Layout>
    );
}
