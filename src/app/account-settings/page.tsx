"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import { Card, Menu, Form, Input, Button, message, Spin } from "antd";
import { getProfile, updateProfile, changePassword, deleteAccount } from "./services/account.service";
import { UserOutlined, LockOutlined, DeleteOutlined } from "@ant-design/icons";



interface Profile {
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "LECTURER" | "STUDENT";
}

const AccountSettingsPage = () => {
  const [activeMenu, setActiveMenu] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);


  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);

      form.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      });
    } catch (err) {
      messageApi.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = (await form.validateFields()) as Pick<Profile, "name" | "phone">;
  
      await updateProfile({
        name: values.name,
        phone: values.phone,
      });
  
      messageApi.success("Profile updated successfully");
      setIsEditing(false);
  
      const updatedProfile = await getProfile();
      setProfile(updatedProfile);
  
      form.setFieldsValue({
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        role: updatedProfile.role,
      });
    } catch (err: any) {
      messageApi.error(err.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    try {
      const values = await form.validateFields([
        "currentPassword",
        "newPassword",
        "confirmPassword",
      ]);
  
      setPasswordLoading(true);
  
      await changePassword(values);
  
      messageApi.success("Password changed successfully");
  
      form.resetFields([
        "currentPassword",
        "newPassword",
        "confirmPassword",
      ]);
    } catch (err: any) {
      messageApi.error(err.message || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };
  
  return (
    <Layout>
      {contextHolder}
      <div className="flex gap-6">
      <Card className="w-64">
        <Menu
          selectedKeys={[activeMenu]}
          onClick={(e) => setActiveMenu(e.key)}
          items={[
            {
              key: "profile",
              label: "My Profile",
              icon: <UserOutlined />,
            },
            {
              key: "password",
              label: "Password",
              icon: <LockOutlined />,
            },
            {
              key: "delete",
              label: (
                <span className="text-red-600 font-semibold">
                  Delete Account
                </span>
              ),
              icon: <DeleteOutlined style={{ color: "red" }} />,
            },
          ]}
        />
      </Card>

        <Card className="flex-1">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : (
            <>
              {activeMenu === "profile" && profile && (
                <>
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">My Profile</h2>
                    <Button onClick={() => setIsEditing(!isEditing)} type="primary">
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  <Form form={form} layout="vertical">
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item label="Role" name="role">
                      <Input disabled /> 
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                      <Input disabled /> 
                    </Form.Item>

                    <Form.Item label="Phone" name="phone">
                      <Input disabled={!isEditing} />
                    </Form.Item>

                    {isEditing && (
                      <Button type="primary" onClick={handleSave}>
                        Save Changes
                      </Button>
                    )}
                  </Form>
                </>
              )}

              {activeMenu === "password" && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                  <Form form={form} layout="vertical" className="max-w-md">
                    <Form.Item
                      label="Current Password"
                      name="currentPassword"
                      rules={[{ required: true, message: "Enter current password" }]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="New Password"
                      name="newPassword"
                      rules={[
                        { required: true, message: "Enter new password" },
                        { min: 8, message: "Password must be at least 8 characters" },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item
                      label="Confirm New Password"
                      name="confirmPassword"
                      dependencies={["newPassword"]}
                      rules={[
                        { required: true, message: "Confirm your password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("newPassword") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error("Passwords do not match"));
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Button
                      type="primary"
                      loading={passwordLoading}
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </Button>
                  </Form>
                </>
              )}


            {activeMenu === "delete" && (
              <div className="max-w-md">
                <h2 className="text-xl font-semibold text-red-600 mb-2">
                  Delete Account
                </h2>

                <p className="text-gray-600 mb-4">
                  This action will deactivate your account. You can only be restored by an admin.
                </p>

                <Form
                  layout="vertical"
                  onFinish={async (values: { password: string; }) => {
                    try {
                      await deleteAccount({ password: values.password });
                      messageApi.success("Account deleted successfully");

                      window.location.href = "/";
                    } catch (err: any) {
                      messageApi.error(err.message || "Incorrect password");
                    }
                  }}
                >
                  <Form.Item
                    label="Confirm Password"
                    name="password"
                    rules={[{ required: true, message: "Password is required" }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Button danger type="primary" htmlType="submit" block>
                    Delete My Account
                  </Button>
                </Form>
              </div>
            )}

            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default AccountSettingsPage;
