"use client";
import { useState, useEffect } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { FaListCheck } from "react-icons/fa6";
import { resetPassword } from "@/app/apis/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [token, setToken] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            messageApi.error("Invalid reset link. Please request a new password reset.");
            setTimeout(() => {
                window.location.href = "/forgot-password";
            }, 2000);
        } else {
            setToken(tokenParam);
        }
    }, [searchParams, messageApi]);

    const handleReset = async (values: { newPassword: string; confirmPassword: string }) => {
        if (!token) {
            messageApi.error("Reset token is missing. Please use a valid reset link.");
            return;
        }

        setLoading(true);
        try {
            const data = await resetPassword({
                token,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            });

            messageApi.success("Password reset successful! Redirecting to login...");
            console.log("Reset data:", data);

            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        } catch (err: any) {
            messageApi.error(err.message || "Password reset failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Spin size="large" />
            </div>
        );
    }

    const validatePassword = (_: any, value: string) => {
        if (!value) return Promise.reject(new Error("Password is required!"));
        if (value.length < 8) return Promise.reject(new Error("Password must be at least 8 characters long!"));
        if (!/[A-Z]/.test(value)) return Promise.reject(new Error("Password must contain at least one uppercase letter!"));
        if (!/[a-z]/.test(value)) return Promise.reject(new Error("Password must contain at least one lowercase letter!"));
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
            return Promise.reject(new Error("Password must contain at least one symbol!"));
        return Promise.resolve();
    };

    const validateConfirmPassword = ({ getFieldValue }: any) => ({
        validator(_: any, value: string) {
            if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error("Passwords do not match!"));
        },
    });

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            {contextHolder}
            <Spin spinning={loading} size="large">
                <div className="p-6 bg-white shadow-md rounded-xl w-96 space-y-4">
                    <div className="flex items-center text-primary gap-2 mb-4">
                        <FaListCheck className="text-[#0267FF] text-2xl" />
                        <h2 className="text-xl font-semibold">PLAGICHECKER</h2>
                    </div>

                    <div className="text-gray-500 space-y-2">
                        <h1 className="text-xl text-black font-semibold">Reset Password</h1>
                        <p>Please enter your new password</p>
                    </div>

                    <Form layout="vertical" onFinish={handleReset} autoComplete="off">
                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[{ validator: validatePassword }]}
                        >
                            <Input.Password placeholder="Enter your new password" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            dependencies={["newPassword"]}
                            rules={[{ required: true, message: "Please confirm your password!" }, validateConfirmPassword]}
                        >
                            <Input.Password placeholder="Confirm your password" />
                        </Form.Item>

                        <div className="text-xs text-gray-500 mb-4">
                            <p>Password requirements:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>At least 8 characters long</li>
                                <li>Contains uppercase letters (A-Z)</li>
                                <li>Contains lowercase letters (a-z)</li>
                                <li>Contains symbols (!@#$%^&*)</li>
                            </ul>
                        </div>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="w-full bg-[#0267FF]">
                                Reset Password
                            </Button>
                        </Form.Item>

                        <div className="text-sm text-center">
                            <Link href="/" className="text-[#0267FF] hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </Form>
                </div>
            </Spin>
        </div>
    );
}
