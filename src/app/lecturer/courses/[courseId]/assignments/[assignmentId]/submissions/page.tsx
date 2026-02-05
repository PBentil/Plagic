"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, message } from "antd";
import Table from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import Layout from "@/app/components/Layout";
import { getScheduleSubmissions, triggerPlagiarismCheck } from "@/app/lecturer/services/lectures.services";

interface Submission {
    id: number;
    studentId: number;
    studentName?: string;
    fileName: string;
    fileUrl: string;
    status: string;
    plagiarismScore?: number;
    submittedAt: string;
}

export default function LecturerSubmissionsPage() {
    const { assignmentId } = useParams();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    const loadSubmissions = async () => {
        setLoading(true);
        try {
            const data = await getScheduleSubmissions(Number(assignmentId));
            setSubmissions(data);
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
    }, [assignmentId]);

    const handleCheck = async (submissionId: number) => {
        try {
            await triggerPlagiarismCheck(submissionId);
            messageApi.success("Plagiarism check triggered");
            loadSubmissions();
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to trigger check");
        }
    };

    const columns: ColumnsType<Submission> = [
        {
            title: "Student",
            render: (_, record) => record.studentName || record.studentId,
        },
        {
            title: "File",
            render: (_, record) => (
                <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
                    {record.fileName}
                </a>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Plagiarism Score",
            render: (_, record) =>
                record.plagiarismScore !== undefined ? `${record.plagiarismScore}%` : "-",
        },
        {
            title: "Submitted At",
            render: (_, record) => new Date(record.submittedAt).toLocaleString(),
        },
        {
            title: "Action",
            render: (_, record) => (
                <Button
                    type="link"
                    disabled={record.status === "checked"}
                    onClick={() => handleCheck(record.id)}
                >
                    Trigger Check
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            {contextHolder}

            <h1 className="text-2xl font-semibold mb-6">Submissions</h1>

            <Table<Submission>
                columns={columns}
                data={submissions}
                loading={loading}
            />

            {!submissions.length && !loading && (
                <p className="text-center text-gray-500 py-6">
                    No submissions found
                </p>
            )}
        </Layout>
    );
}
