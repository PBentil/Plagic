"use client";

import React, { useState } from "react";
import Layout from "@/app/components/Layout";
import { Form, Input, Upload, Button, message, Card, Radio, Spin, Table } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { checkFile, checkText } from "@/app/admin/checker/service/checkerService";

const { Dragger } = Upload;

const CheckerPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [mode, setMode] = useState<"file" | "text">("file");
    const [messageApi, contextHolder] = message.useMessage();

    const handleModeChange = (e: any) => {
        setMode(e.target.value);
        form.resetFields();
        setResult(null);
    };

    const handleCheck = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            setResult(null);

            let response;

            if (mode === "file") {
                const fileList = values.file;
                if (!fileList || fileList.length === 0) {
                    messageApi.error("Please upload a file.");
                    setLoading(false);
                    return;
                }

                const file = fileList[0].originFileObj;
                if (!file) {
                    messageApi.error("Invalid file selected.");
                    setLoading(false);
                    return;
                }

                response = await checkFile(file);
            } else {
                response = await checkText(values.text);
            }

            if (!response.success) {
                messageApi.error(response.message || "Check failed.");
            } else {
                messageApi.success("Check completed successfully!");
            }

            setResult(response);
        } catch (err: any) {
            console.error("Check failed:", err);
            messageApi.error(err.message || "An error occurred during the check.");
        } finally {
            setLoading(false);
        }
    };

    const renderResultData = (data: any) => {
        if (!data) return <p className="text-gray-500">No data returned.</p>;

        if (Array.isArray(data)) {
            if (data.length === 0) return <p className="text-gray-500">No results found.</p>
            const columns = Object.keys(data[0]).map((key) => ({
                title: key.charAt(0).toUpperCase() + key.slice(1),
                dataIndex: key,
                key,
            }));
            return <Table dataSource={data} columns={columns} pagination={false}
                          rowKey={(r) => r.id || r.key || JSON.stringify(r)}/>;
        }

        if (typeof data === "object") {
            return (
                <div className="space-y-1">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key}>
                            <strong className="capitalize">{key}: </strong>
                            <span>{typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}</span>
                        </div>
                    ))}
                </div>
            );
        }

        return <p>{String(data)}</p>;
    };

    return (
        <Layout>
            {contextHolder}
            <div className="flex flex-col bg-gray-50 p-4 min-h-screen">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">Plagiarism Checker</h1>
                        <p>Upload a document OR enter text to check for similarity</p>
                    </div>
                </div>

                <Card className="p-6 shadow-md rounded-xl bg-white">
                    <div className="mb-4">
                        <Radio.Group onChange={handleModeChange} value={mode}>
                            <Radio.Button value="file">Upload File</Radio.Button>
                            <Radio.Button value="text">Enter Text</Radio.Button>
                        </Radio.Group>
                    </div>

                    <Form form={form} layout="vertical">
                        {mode === "text" ? (
                            <Form.Item
                                name="text"
                                label="Text Input"
                                rules={[{required: true, message: "Please enter text to check."}]}
                            >
                                <Input.TextArea rows={4} placeholder="Enter text here..."/>
                            </Form.Item>
                        ) : (
                            <Form.Item
                                name="file"
                                label="Upload File"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => e.fileList}
                                rules={[{required: true, message: "Please upload a file."}]}
                            >
                                <Dragger
                                    multiple={false}
                                    beforeUpload={() => false}
                                    accept=".pdf"
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined/>
                                    </p>
                                    <p className="ant-upload-text">
                                        Click or drag file to this area to upload
                                    </p>
                                    <p className="ant-upload-hint">
                                        Supports PDF files.
                                    </p>
                                </Dragger>
                            </Form.Item>
                        )}

                        <Button
                            type="primary"
                            onClick={handleCheck}
                            loading={loading}
                            className="mt-3 bg-blue-600 hover:bg-blue-700"
                        >
                            Run Check
                        </Button>
                    </Form>
                </Card>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-3">Results</h2>
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <Spin size="large"/>
                        </div>
                    ) : result ? (
                        <Card className="bg-white shadow-md rounded-lg p-6 space-y-4">
                            {result.message && (
                                <p className="text-lg font-semibold text-green-700">
                                    {result.message}
                                </p>
                            )}

                            {result.plagiarismScore && (
                                <div className="flex flex-wrap gap-6">
                                    <div>
                                        <strong>Plagiarism Score:</strong>{" "}
                                        <span className="text-red-600 font-semibold">
              {result.plagiarismScore}
            </span>
                                    </div>
                                    {result.matchedWith && (
                                        <div>
                                            <strong>Matched With:</strong>{" "}
                                            <span className="text-blue-600">{result.matchedWith}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {result.record && (
                                <div className="mt-4 border-t pt-4 space-y-2">
                                    <p className="font-medium text-gray-800">Record Details</p>

                                    <div>
                                        <strong>Scan ID:</strong> {result.record.scanId}
                                    </div>

                                    <div>
                                        <strong>Plagiarism Score:</strong>{" "}
                                        {result.record.plagiarismScore.toFixed(2)}%
                                    </div>

                                    <div>
                                        <strong>Created At:</strong>{" "}
                                        {new Date(result.record.createdAt).toLocaleString()}
                                    </div>

                                    {result.record.fileUrl && (
                                        <div className="mt-2">
                                            <a
                                                href={result.record.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Uploaded File
                                            </a>
                                        </div>
                                    )}

                                    {result.record.matches && (
                                        <div className="mt-3">
                                            <p className="font-semibold text-gray-700">Matched Content:</p>
                                            <div
                                                className="max-h-64 overflow-y-auto bg-gray-100 p-3 rounded-md text-sm text-gray-800 whitespace-pre-wrap">
                                                {result.record.matches}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    ) : (
                        <p className="text-gray-500 italic">
                            No results yet. Upload a file or enter text to run a check.
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default CheckerPage;
