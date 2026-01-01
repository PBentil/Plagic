"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import { Modal, Form, Input, Select, message, Upload, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { IoCloudUploadOutline } from "react-icons/io5";
import CustomTable from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import { getFaculties } from "@/app/services/admin.services";
import { getAllArchives, getArchivesByFaculty, uploadArchive } from "@/app/admin/archive/services/archive.services";

const { Dragger } = Upload;

interface Archive {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
    faculty: { id: number; name: string };
}

interface Faculty {
    id: number;
    name: string;
}

const ArchivePage = () => {
    const [archives, setArchives] = useState<Archive[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        fetchData();
        loadFaculties();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllArchives();
            setArchives(data);
        } catch (err) {
            console.error(err);
            messageApi.error("Failed to fetch archives");
        } finally {
            setLoading(false);
        }
    };

    const loadFaculties = async () => {
        try {
            const data = await getFaculties();
            setFaculties(data);
        } catch (err) {
            console.error("Error loading faculties:", err);
        }
    };

    const handleFilterChange = async (facultyId: number) => {
        setSelectedFaculty(facultyId);
        setLoading(true);
        try {
            const data = await getArchivesByFaculty(facultyId);
            setArchives(data);
        } catch {
            messageApi.error("Failed to filter archives");
        } finally {
            setLoading(false);
        }
    };

    const archiveColumns: ColumnsType<Archive> = [
        { title: "Title", dataIndex: "title", key: "title" },
        { title: "Description", dataIndex: "description", key: "description" },
        {
            title: "Faculty",
            key: "faculty",
            render: (_, record) => record.faculty?.name || "N/A",
        },
        {
            title: "File",
            key: "fileUrl",
            render: (_, record) => (
                <Button
                    onClick={() => window.open(record.fileUrl, "_blank")}
                    type="primary"
                >
                    View PDF
                </Button>

            ),
        },
    ];

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const fileList = values.file;

            if (!fileList || fileList.length === 0) {
                messageApi.error("Please select a PDF file");
                return;
            }

            const file = fileList[0].originFileObj;
            if (!file) {
                messageApi.error("Invalid file selected");
                return;
            }

            const formData = new FormData();
            formData.append("file", file); 
            formData.append("facultyId", values.facultyId);
            formData.append("title", values.title);
            formData.append("description", values.description);

            setIsSubmitting(true);
            const response = await uploadArchive(formData);

            messageApi.success("File uploaded successfully!");
            setIsModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (err) {
            console.error("Upload failed:", err);
            messageApi.error("Upload failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            {contextHolder}
            <div className="flex flex-col bg-gray-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                    <div className="text-black">
                        <h1 className="text-2xl">Database</h1>
                        <p className="text-gray-500">Upload Past Project works here</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                    <Select
                        placeholder="Filter by Faculty"
                        className="w-48"
                        onChange={handleFilterChange}
                        allowClear
                        value={selectedFaculty ?? undefined}
                        options={faculties.map((f) => ({
                            label: f.name,
                            value: f.id,
                        }))}
                        />


                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            Upload PDF <IoCloudUploadOutline />
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <CustomTable<Archive> columns={archiveColumns} data={archives} loading={loading} />
                </div>
            </div>

            <Modal
                title="Upload Archive"
                open={isModalOpen}
                onOk={handleOk}
                confirmLoading={isSubmitting}
                onCancel={() => setIsModalOpen(false)}
                okText="Upload"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please enter a title" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please enter a description" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="facultyId"
                        label="Faculty"
                        rules={[{ required: true, message: "Please select a faculty" }]}
                        >
                        <Select
                            placeholder="Select faculty"
                            options={faculties.map((f) => ({
                            label: f.name,
                            value: f.id,
                            }))}
                        />
                    </Form.Item>


                    <Form.Item
                        name="file"
                        label="Upload PDF"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                        rules={[{ required: true, message: "Please upload a PDF file" }]}
                    >
                        <Dragger
                            multiple={false}
                            accept=".pdf"
                            beforeUpload={() => false} 
                        >

                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag PDF file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Only PDF files are accepted
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default ArchivePage;
