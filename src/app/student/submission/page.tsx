"use client";

import { useEffect, useState } from "react";
import { Table, message, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Layout from "@/app/components/Layout";
import { getMySubmissions } from "@/app/student/services/student.service";

interface Submission {
    id: number;
    fileName: string;
    status: string;
    plagiarismScore?: number;
    submittedAt: string;
    processedAt?: string;
    schedule: {
        assignmentName: string;
        course: {
            courseName: string;
        };
    };
}

export default function StudentSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSubmissions = async () => {
        setLoading(true);
        try {
            const data = await getMySubmissions();
            setSubmissions(data);
        } catch (err) {
            console.error(err);
            message.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
    }, []);

    const columns: ColumnsType<Submission> = [
        {
            title: "Assignment",
            dataIndex: ["schedule", "assignmentName"],
            key: "assignmentName",
        },
        {
            title: "Course",
            dataIndex: ["schedule", "course", "courseName"],
            key: "courseName",
        },
        {
            title: "File",
            dataIndex: "fileName",
            key: "fileName",
            render: (text) => text,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "blue";
                if (status === "checked") color = "green";
                else if (status === "failed") color = "red";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Plagiarism Score",
            dataIndex: "plagiarismScore",
            key: "plagiarismScore",
            render: (score) => (score !== undefined ? `${score}%` : "-"),
        },
        {
            title: "Submitted At",
            dataIndex: "submittedAt",
            key: "submittedAt",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Processed At",
            dataIndex: "processedAt",
            key: "processedAt",
            render: (text) => (text ? new Date(text).toLocaleString() : "-"),
        },
    ];

    return (
        <Layout>
            <h1 className="text-2xl font-semibold mb-6">My Submissions</h1>

            <Table
                columns={columns}
                dataSource={submissions}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
        </Layout>
    );
}
