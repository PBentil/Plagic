'use client'
import { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { FaListCheck } from "react-icons/fa6";
import { loginUser } from "@/app/apis/api";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleLogin = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const data = await loginUser(values.email, values.password);
            messageApi.success("Login successful!");
            console.log("User data:", data);

            window.location.href = "/dashboard";
        } catch (err: any) {
            messageApi.error(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="text-xl text-black font-semibold">Login</h1>
                        <p>Please enter your login details to access your account</p>
                    </div>

                    <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please enter your email!" },
                                { type: "email", message: "Please enter a valid email!" },
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please enter your password!" }]}
                        >
                            <Input.Password placeholder="Enter your password" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="w-full bg-[#0267FF]">
                                Login
                            </Button>
                        </Form.Item>

                        <div className="text-sm text-center">
                            <a href="/auth/forgot-password" className="text-[#0267FF]">
                                Forgot password?
                            </a>
                        </div>
                    </Form>
                </div>
            </Spin>
        </div>
    );
}
