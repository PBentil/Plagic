"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import { Card, Menu, Form, Input, Button, message, Spin } from "antd";
import { getProfile, updateProfile } from "./services/account.service";
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
                <h2 className="text-xl font-semibold">Password Section</h2>
              )}

              {activeMenu === "delete" && (
                <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
              )}
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default AccountSettingsPage;
