"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Checkbox,
    message,
    InputNumber,
    Select,
} from "antd";
import Table from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import Layout from "@/app/components/Layout";
import {
    addSchedule,
    getMyLecturerSchedules,
    publishSchedule,
} from "@/app/lecturer/services/lectures.services";


interface Course {
    id: number;
    courseCode: string;
    courseName: string;
}

interface Schedule {
    id: number;
    assignmentName: string;
    assignmentDescription?: string;
    deadline: string;
    status: string;
    allowedFileFormats: string[];
    maxFileSizeMb: number;
    lateSubmissionAllowed: boolean;
    maxSubmissionsAllowed: number;
    autoCheckEnabled: boolean;
    similarityThresholdPercentage: number;
    selfCheckEnabled: boolean;
    maxSelfCheckAttempts: number;
    course: Course;
}


export default function LecturerAssignmentsPage() {
    const { courseId } = useParams();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const loadSchedules = async () => {
        setLoading(true);
        try {
            const data = await getMyLecturerSchedules();
            const filtered = data.filter((s: Schedule) => s.course.id === Number(courseId));
            setSchedules(filtered);
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to load assignments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSchedules();
    }, [courseId]);

    const handleSubmit = async (values: any) => {
        try {
            await addSchedule({
                courseId: Number(courseId),
                assignmentName: values.assignmentName,
                assignmentDescription: values.assignmentDescription,
                deadline: values.deadline.toISOString(),
                lateSubmissionAllowed: values.lateSubmissionAllowed || false,
                allowedFileFormats: values.allowedFileFormats,
                maxFileSizeMb: values.maxFileSizeMb,
                maxSubmissionsAllowed: values.maxSubmissionsAllowed || 1,
                autoCheckEnabled: values.autoCheckEnabled || false,
                similarityThresholdPercentage: values.similarityThresholdPercentage || 30,
                selfCheckEnabled: values.selfCheckEnabled || false,
                maxSelfCheckAttempts: values.maxSelfCheckAttempts || 3,
            });
            messageApi.success("Assignment created successfully");
            setModalVisible(false);
            form.resetFields();
            loadSchedules();
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to create assignment");
        }
    };

    const handlePublish = async (scheduleId: number) => {
        try {
            await publishSchedule(scheduleId);
            messageApi.success("Assignment published successfully");
            loadSchedules();
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to publish assignment");
        }
    };

    const columns: ColumnsType<Schedule> = [
        {
            title: "Assignment",
            dataIndex: "assignmentName",
            key: "assignmentName",
        },
        {
            title: "Deadline",
            render: (_, record) => new Date(record.deadline).toLocaleString(),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    {record.status === "draft" && (
                        <Button type="link" onClick={() => handlePublish(record.id)}>
                            Publish
                        </Button>
                    )}
                    <Button
                        type="link"
                        href={`/lecturer/assignments/${record.id}/submissions`}
                    >
                        View Submissions
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            {contextHolder}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-black">Assignments</h1>
                <Button type="primary" onClick={() => setModalVisible(true)}>
                    + New Assignment
                </Button>
            </div>

            <Table<Schedule>
                columns={columns}
                data={schedules}
                loading={loading}
            />

            <Modal
                title="New Assignment"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                okText="Create"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Assignment Name"
                        name="assignmentName"
                        rules={[{ required: true, message: "Enter assignment name" }]}
                    >
                        <Input placeholder="Assignment 1: Research Paper" />
                    </Form.Item>

                    <Form.Item
                        label="Assignment Description"
                        name="assignmentDescription"
                    >
                        <Input.TextArea rows={3} placeholder="Optional description" />
                    </Form.Item>

                    <Form.Item
                        label="Deadline"
                        name="deadline"
                        rules={[{ required: true, message: "Select deadline" }]}
                    >
                        <DatePicker showTime />
                    </Form.Item>

                    <Form.Item
                        name="lateSubmissionAllowed"
                        valuePropName="checked"
                    >
                        <Checkbox>Allow late submission</Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Allowed File Formats"
                        name="allowedFileFormats"
                        rules={[{ required: true, message: "Select at least one format" }]}
                    >
                        <Select
                            mode="multiple"
                            options={[
                                { label: "PDF", value: "pdf" },
                                { label: "DOCX", value: "docx" },
                                { label: "TXT", value: "txt" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Max File Size (MB)"
                        name="maxFileSizeMb"
                        rules={[{ required: true, message: "Enter max file size" }]}
                    >
                        <InputNumber min={1} max={100} />
                    </Form.Item>

                    <Form.Item
                        label="Max Submissions Allowed"
                        name="maxSubmissionsAllowed"
                        rules={[{ required: true, message: "Enter max submissions allowed" }]}
                    >
                        <InputNumber min={1} max={10} />
                    </Form.Item>

                    <Form.Item
                        name="autoCheckEnabled"
                        valuePropName="checked"
                    >
                        <Checkbox>Enable Automatic Plagiarism Check</Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Similarity Threshold (%)"
                        name="similarityThresholdPercentage"
                    >
                        <InputNumber min={1} max={100} />
                    </Form.Item>

                    <Form.Item
                        name="selfCheckEnabled"
                        valuePropName="checked"
                    >
                        <Checkbox>Enable Self Check</Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Max Self Check Attempts"
                        name="maxSelfCheckAttempts"
                    >
                        <InputNumber min={1} max={10} />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}
