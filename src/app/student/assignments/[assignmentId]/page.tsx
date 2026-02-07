"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { message, Upload, Button, Tag } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Layout from "@/app/components/Layout";
import {
    getSubmissionById,
    submitAssignment,
    getMyAssignments,
} from "@/app/student/services/student.service";

export default function AssignmentSubmissionPage() {
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submission, setSubmission] = useState<any>(null);

    const loadAssignment = async () => {
        try {
            const data = await getMyAssignments();
            const found = data.find((a: any) => a.id === Number(assignmentId));
            if (!found) throw new Error("Assignment not found");
            setAssignment(found);

            const submissions = await getSubmissionById(found.id);
            if (submissions) setSubmission(submissions);
        } catch (err) {
            console.error(err);
            message.error("Failed to load assignment");
        }
    };

    useEffect(() => {
        loadAssignment();
    }, [assignmentId]);

    const handleUpload = async () => {
        if (!file) return message.warning("Please select a file first");
        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            await submitAssignment(Number(assignmentId), formData);
            message.success("File submitted successfully");
            setFile(null);
            loadAssignment();
        } catch (err) {
            console.error(err);
            message.error("Failed to submit file");
        } finally {
            setUploading(false);
        }
    };

    if (!assignment) return <Layout>Loading...</Layout>;

    return (
        <Layout>
            <h1 className="text-2xl font-semibold mb-4">{assignment.assignmentName}</h1>
            <p className="mb-2">{assignment.assignmentDescription}</p>
            <p className="mb-4">
                Deadline: {new Date(assignment.deadline).toLocaleString()}
            </p>

            {submission ? (
                <div className="space-y-2">
                    <p>
                        <strong>Status:</strong>{" "}
                        <Tag color={submission.status === "checked" ? "green" : "blue"}>
                            {submission.status.toUpperCase()}
                        </Tag>
                    </p>
                    <p>
                        <strong>Plagiarism Score:</strong>{" "}
                        {submission.plagiarismScore !== undefined
                            ? `${submission.plagiarismScore}%`
                            : "-"}
                    </p>
                    <p>
                        <strong>Submitted At:</strong>{" "}
                        {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                    {submission.processedAt && (
                        <p>
                            <strong>Processed At:</strong>{" "}
                            {new Date(submission.processedAt).toLocaleString()}
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <Upload
                        beforeUpload={(file) => {
                            setFile(file);
                            return false;
                        }}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                    {file && <p>Selected File: {file.name}</p>}
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        loading={uploading}
                        disabled={!file}
                    >
                        Submit Assignment
                    </Button>
                </div>
            )}
        </Layout>
    );
}
