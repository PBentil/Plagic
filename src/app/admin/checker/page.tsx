"use client";

import React, { useState } from "react";
import Layout from "@/app/components/Layout";
import {
  Form,
  Input,
  Upload,
  Button,
  message,
  Card,
  Radio,
  Spin,
} from "antd";
import type { RadioChangeEvent } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { checkFile, checkText } from "@/app/admin/checker/service/checker.service";
import type { RcFile } from "antd/es/upload";




const { Dragger } = Upload;


type Mode = "file" | "text";

interface CheckerRecord {
  scanId: string;
  plagiarismScore: number;
  createdAt: string;
  fileUrl?: string;
  matches?: string;
}

interface CheckerResult {
  success: boolean;
  message?: string;
  plagiarismScore?: number;
  matchedWith?: string;
  record?: CheckerRecord;
}


const CheckerPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckerResult | null>(null);
  const [mode, setMode] = useState<Mode>("file");
  const [messageApi, contextHolder] = message.useMessage();



  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
    form.resetFields();
    setResult(null);
  };

  const handleCheck = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setResult(null);

      let response: CheckerResult;

      if (mode === "file") {
        const fileList = values.file;
        if (!fileList || fileList.length === 0) {
          messageApi.error("Please upload a file.");
          return;
        }

        const file = fileList[0]?.originFileObj;
        if (!file) {
          messageApi.error("Invalid file selected.");
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
      console.error(err);
      messageApi.error(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <Layout>
      {contextHolder}

      <div className="flex flex-col bg-gray-50 p-4 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black">
            Plagiarism Checker
          </h1>
          <p className="text-gray-500">
            Upload a document or enter text to check for similarity
          </p>
        </div>

        <div className="p-6 shadow-md rounded-xl bg-white">
        <Card>
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
                rules={[
                  { required: true, message: "Please enter text to check." },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter text here..."
                />
              </Form.Item>
            ) : (
              <Form.Item
                name="file"
                label="Upload File"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  Array.isArray(e) ? e : e?.fileList
                }
                rules={[
                  { required: true, message: "Please upload a PDF file." },
                ]}
              >
               <Dragger
                multiple={false}
                accept=".pdf"
                beforeUpload={(file: RcFile) => {
                    if (file.type !== "application/pdf") {
                    messageApi.error("Only PDF files are allowed.");
                    return Upload.LIST_IGNORE;
                    }
                    return false; 
                }}
                >

                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Supports PDF files only.
                  </p>
                </Dragger>
              </Form.Item>
            )}

            <Button
              type="primary"
              onClick={handleCheck}
              loading={loading}
              disabled={loading}
              className="mt-3 bg-blue-600 hover:bg-blue-700"
            >
              Run Check
            </Button>
          </Form>
        </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl text-black font-semibold mb-3">
            Results
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : result ? (
            <Card className="bg-white shadow-md rounded-lg p-6 space-y-4">
              {result.message && (
                <p className="text-lg font-semibold text-green-700">
                  {result.message}
                </p>
              )}

              {typeof result.plagiarismScore === "number" && (
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <strong>Plagiarism Score:</strong>{" "}
                    <span className="text-red-600 font-semibold">
                      {result.plagiarismScore}%
                    </span>
                  </div>

                  {result.matchedWith && (
                    <div>
                      <strong>Matched With:</strong>{" "}
                      <span className="text-blue-600">
                        {result.matchedWith}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {result.record && (
                <div className="border-t pt-4 space-y-2">
                  <p className="font-medium text-gray-800">
                    Record Details
                  </p>

                  <div>
                    <strong>Scan ID:</strong> {result.record.scanId}
                  </div>

                  {typeof result.record.plagiarismScore === "number" && (
                    <div>
                      <strong>Plagiarism Score:</strong>{" "}
                      {result.record.plagiarismScore.toFixed(2)}%
                    </div>
                  )}

                  <div>
                    <strong>Created At:</strong>{" "}
                    {new Date(
                      result.record.createdAt
                    ).toLocaleString()}
                  </div>

                  {result.record.fileUrl && (
                    <a
                      href={result.record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Uploaded File
                    </a>
                  )}

                  {result.record.matches && (
                    <div>
                      <p className="font-semibold text-gray-700">
                        Matched Content:
                      </p>
                      <div className="max-h-64 overflow-y-auto bg-gray-100 p-3 rounded-md text-sm whitespace-pre-wrap">
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
};

export default CheckerPage;
