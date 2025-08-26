'use client'
import { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { FaListCheck } from "react-icons/fa6";
import Link from "next/link";
import {forgotPassword} from "@/app/apis/api";

export default function page() {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleForgot = async (values: { email: string }) => {
        setLoading(true);
        try {
            const data = await forgotPassword(values.email);
            messageApi.success("Reset link sent successful!");
            console.log("User data:", data);

        } catch (err: any) {
            messageApi.error(err.message || "Failed to send reset link!");
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
                        <h1 className="text-xl text-black font-semibold">Forgot Password</h1>
                        <p>Please enter your email to receive the reset link in your mail</p>
                    </div>

                    <Form layout="vertical" onFinish={handleForgot} autoComplete="off">
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please enter your email!" },
                                { type: "email", message: "Please enter a valid email!" },
                            ]}
                        >
                            <Input placeholder=" Enter your email" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="w-full bg-[#0267FF]">
                                Send reset link
                            </Button>
                        </Form.Item>

                        <div className="text-sm text-center">
                            <Link href="/" className="text-gray-700">
                               back to login
                            </Link>
                        </div>
                    </Form>
                </div>
            </Spin>
        </div>
    );
}
