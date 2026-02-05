"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, message, Card, Descriptions } from "antd";
import Layout from "@/app/components/Layout";
import { getSubmission, triggerPlagiarismCheck } from "@/app/lecturer/services/lectures.services";

interface Submission {
    id: number;
    studentId: number;
    studentName: string;
    fileName: string;
    fileUrl: string;
    status: string;
    plagiarismScore?: number;
    submittedAt: string;
    feedback?: string;
}

export default function SubmissionDetailPage() {
    const { submissionId } = useParams();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    const loadSubmission = async () => {
        setLoading(true);
        try {
            const data = await getSubmission(Number(submissionId));
            setSubmission(data);
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to load submission");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubmission();
    }, [submissionId]);

    const handleCheck = async () => {
        if (!submission) return;
        try {
            await triggerPlagiarismCheck(submission.id);
            messageApi.success("Plagiarism check triggered");
            loadSubmission();
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to trigger check");
        }
    };

    if (loading || !submission) {
        return (
            <Layout>
                {contextHolder}
                <p className="text-center py-6">Loading submission...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            {contextHolder}

            <h1 className="text-2xl font-semibold mb-6">Submission Details</h1>

            <Card className="mb-6">
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Student">
                        {submission.studentName} (ID: {submission.studentId})
                    </Descriptions.Item>
                    <Descriptions.Item label="File">
                        <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                            {submission.fileName}
                        </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">{submission.status}</Descriptions.Item>
                    <Descriptions.Item label="Plagiarism Score">
                        {submission.plagiarismScore !== undefined ? `${submission.plagiarismScore}%` : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Submitted At">
                        {new Date(submission.submittedAt).toLocaleString()}
                    </Descriptions.Item>
                    {submission.feedback && (
                        <Descriptions.Item label="Feedback">{submission.feedback}</Descriptions.Item>
                    )}
                </Descriptions>
            </Card>

            {submission.status !== "checked" && (
                <Button type="primary" onClick={handleCheck}>
                    Trigger Plagiarism Check
                </Button>
            )}
        </Layout>
    );
}
