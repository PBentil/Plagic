'use client'
import { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { FaShieldAlt, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { loginUser } from "@/app/services/auth";
import Link from "next/link";
import {FaListCheck} from "react-icons/fa6";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleLogin = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const data = await loginUser(values.email, values.password);
            messageApi.success("Login successful!");
            localStorage.setItem("user", JSON.stringify(data.user));

            switch (data.user.role) {
                case "ADMIN":
                    window.location.href = "/admin/dashboard";
                    break;
                case "LECTURER":
                    window.location.href = "/lecturer/dashboard";
                    break;
                case "STUDENT":
                    window.location.href = "/student/dashboard";
                    break;
                default:
                    messageApi.warning("No valid role found. Redirecting to home.");
                    window.location.href = "/";
            }
        } catch (err: any) {
            messageApi.error(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
            {contextHolder}

            <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0267FF] via-[#0052CC] to-[#003D99] p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <FaListCheck className="text-white text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">PLAGICHECKER</h2>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                            Academic Integrity<br />Made Simple
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Ensuring originality and maintaining academic standards with advanced plagiarism detection.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/20 rounded-lg mt-1">
                                <FaShieldAlt className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Secure & Reliable</h3>
                                <p className="text-blue-100 text-sm">Enterprise-grade security for your documents</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/20 rounded-lg mt-1">
                                <FaUserGraduate className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Student Dashboard</h3>
                                <p className="text-blue-100 text-sm">Track submissions and view reports</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white/20 rounded-lg mt-1">
                                <FaChalkboardTeacher className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Lecturer Tools</h3>
                                <p className="text-blue-100 text-sm">Comprehensive review and grading system</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <Spin spinning={loading} tip="Signing you in...">
                        <div className="w-full max-w-md mx-auto">
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                                <FaListCheck className="text-[#0267FF] text-2xl" />
                                <h2 className="text-xl font-semibold text-gray-800">PLAGICHECKER</h2>
                            </div>

                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                                <p className="text-gray-600">Please enter your credentials to continue</p>
                            </div>

                            <Form
                                layout="vertical"
                                onFinish={handleLogin}
                                autoComplete="off"
                                disabled={loading}
                                className="space-y-1"
                            >
                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Email Address</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: "Please enter your email!" },
                                        { type: "email", message: "Please enter a valid email!" },
                                    ]}
                                >
                                    <Input
                                        placeholder="you@example.com"
                                        size="large"
                                        className="rounded-xl"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Password</span>}
                                    name="password"
                                    rules={[
                                        { required: true, message: "Please enter your password!" }
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="Enter your password"
                                        size="large"
                                        className="rounded-xl"
                                    />
                                </Form.Item>

                                <div className="flex items-center justify-end mb-6">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-[#0267FF] hover:text-[#0052CC] font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <Form.Item className="mb-4">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        size="large"
                                        className="w-full bg-gradient-to-r from-[#0267FF] to-[#0052CC] hover:from-[#0052CC] hover:to-[#003D99] border-0 rounded-xl font-semibold h-12 shadow-lg shadow-blue-500/30 transition-all duration-300"
                                    >
                                        {loading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </Form.Item>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">New to PLAGICHECKER?</span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-gray-600">
                                        Contact your administrator for account access
                                    </p>
                                </div>
                            </Form>
                        </div>
                    </Spin>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .ant-form-item {
                    animation: fadeInUp 0.5s ease-out;
                }
                
                .ant-input,
                .ant-input-password {
                    transition: all 0.3s ease;
                }
                
                .ant-input:focus,
                .ant-input-password:focus,
                .ant-input-affix-wrapper:focus,
                .ant-input-affix-wrapper-focused {
                    border-color: #0267FF;
                    box-shadow: 0 0 0 2px rgba(2, 103, 255, 0.1);
                }
            `}</style>
        </div>
    );
}