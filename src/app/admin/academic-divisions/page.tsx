"use client";
import React, { useEffect, useState } from "react";
import {getFaculties, addFaculty, addDepartment, updateFaculty, deleteFaculty, deleteDepartment, updateDepartment} from "@/app/services/adminDashboard";
import Layout from "@/app/components/Layout";
import CustomTable from "@/app/components/table";
import type { ColumnsType } from "antd/es/table";
import {
    Modal,
    Form,
    Input,
    message,
    Button,
    Popconfirm,
    Dropdown,
    Space,
} from "antd";
import { AxiosError } from "axios";
import {
    EditOutlined,
    DeleteOutlined,
    DownOutlined,
    PlusOutlined
} from '@ant-design/icons';

interface Department {
    id: number;
    name: string;
}

interface Faculty {
    id: number;
    name: string;
    departments: Department[];
}

const AcademicDivisions = () => {
    const [loading, setLoading] = useState(true);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    const [isEditFacultyModalOpen, setIsEditFacultyModalOpen] = useState(false);
    const [isEditDeptModalOpen, setIsEditDeptModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
    const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const [facultyForm] = Form.useForm();
    const [deptForm] = Form.useForm();
    const [editFacultyForm] = Form.useForm();
    const [editDeptForm] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    async function fetchData() {
        setLoading(true);
        try {
            const facultyList = await getFaculties();
            setFaculties(facultyList);
        } catch (error) {
            console.error("Error fetching faculties:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditFaculty = (faculty: Faculty) => {
        setEditingFaculty(faculty);
        editFacultyForm.setFieldsValue({ name: faculty.name });
        setIsEditFacultyModalOpen(true);
    };

    const handleUpdateFaculty = async () => {
        try {
            const values = await editFacultyForm.validateFields();
            setIsSubmitting(true);

            await updateFaculty(editingFaculty.id, values);

            messageApi.success("Faculty updated successfully");
            setIsEditFacultyModalOpen(false);
            editFacultyForm.resetFields();
            setEditingFaculty(null);
            fetchData();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const backendMessage =
                axiosErr.response?.data?.message ||
                axiosErr.message ||
                "Failed to update faculty";
            messageApi.error(backendMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteFaculty = async (facultyId: number) => {
        try {
            await deleteFaculty(facultyId);
            messageApi.success("Faculty deleted successfully");
            fetchData();
        } catch (error) {
            messageApi.error("Failed to delete faculty");
        }
    };


    const handleEditDepartment = (dept: Department, facultyId: number) => {
        setEditingDepartment(dept);
        setSelectedFacultyId(facultyId);
        editDeptForm.setFieldsValue({
            name: dept.name,
            facultyId: facultyId
        });
        setIsEditDeptModalOpen(true);
    };

    const handleUpdateDepartment = async () => {
        try {
            const values = await editDeptForm.validateFields();
            setIsSubmitting(true);
            await updateDepartment(editingDepartment!.id, values);

            messageApi.success("Department updated successfully");
            setIsEditDeptModalOpen(false);
            editDeptForm.resetFields();
            setEditingDepartment(null);
            fetchData();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const backendMessage =
                axiosErr.response?.data?.message ||
                axiosErr.message ||
                "Failed to update department";
            messageApi.error(backendMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDepartment = async (deptId: number) => {
        try {
            await deleteDepartment(deptId);
            messageApi.success("Department deleted successfully");
            fetchData();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const backendMessage =
                axiosErr.response?.data?.message ||
                axiosErr.message ||
                "Failed to delete department";
            messageApi.error(backendMessage);
        }
    };


    const getDepartmentDropdownItems = (departments: Department[], facultyId: number) => {
        if (!departments || departments.length === 0) {
            return [
                {
                    key: 'no-departments',
                    label: (
                        <span className="text-gray-400 italic">No departments</span>
                    ),
                    disabled: true,
                }
            ];
        }

        return departments.map((dept) => ({
            key: dept.id,
            label: (
                <div className="flex items-center justify-between w-full min-w-[200px]">
                    <span className="flex-1">{dept.name}</span>
                    <div className="flex gap-1 ml-2">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditDepartment(dept, facultyId);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                        />
                        <Popconfirm
                            title="Delete this department?"
                            onConfirm={(e) => {
                                e?.stopPropagation();
                                handleDeleteDepartment(dept.id);
                            }}
                            onClick={(e) => e?.stopPropagation()}
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                className="text-red-600 hover:text-red-800"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Popconfirm>
                    </div>
                </div>
            ),
        }));
    };

    const facultyColumns: ColumnsType<Faculty> = [
        {
            title: "Faculty ID",
            dataIndex: "id",
            key: "id",
            width: 100,
        },
        {
            title: "Faculty Name",
            dataIndex: "name",
            key: "name",
            width: 200,
        },
        {
            title: "Departments",
            key: "departments",
            width: 250,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            ...getDepartmentDropdownItems(record.departments, record.id),
                            {
                                type: 'divider',
                            },
                            {
                                key: 'add-department',
                                label: (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <PlusOutlined />
                                        <span>Add New Department</span>
                                    </div>
                                ),
                                onClick: () => {
                                    setSelectedFacultyId(record.id);
                                    setIsDeptModalOpen(true);
                                }
                            }
                        ]
                    }}
                    trigger={['click']}
                    placement="bottomLeft"
                >
                    <Button className="w-full">
                        <Space>
                            Departments ({record.departments?.length || 0})
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditFaculty(record)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Faculty"
                    />
                    <Popconfirm
                        title="Are you sure to delete this faculty?"
                        description="This will also delete all departments under this faculty."
                        onConfirm={() => handleDeleteFaculty(record.id)}
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Faculty"
                        />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const handleAddFaculty = async () => {
        try {
            const values = await facultyForm.validateFields();
            setIsSubmitting(true);

            await addFaculty(values);
            messageApi.success("Faculty added successfully");

            setIsFacultyModalOpen(false);
            facultyForm.resetFields();
            fetchData();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const backendMessage =
                axiosErr.response?.data?.message ||
                axiosErr.message ||
                "Failed to add faculty or faculty already exists";
            messageApi.error(backendMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddDepartment = async () => {
        try {
            const values = await deptForm.validateFields();
            setIsSubmitting(true);

            await addDepartment(values);
            messageApi.success("Department added successfully");

            setIsDeptModalOpen(false);
            deptForm.resetFields();
            fetchData();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const backendMessage =
                axiosErr.response?.data?.message ||
                axiosErr.message ||
                "Failed to add department or department already exists";
            messageApi.error(backendMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            {contextHolder}
            <div className="flex flex-col bg-gray-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b p-4 gap-3">
                    <div>
                        <h2 className="text-xl text-black font-semibold">Faculties</h2>
                        <h2 className="text-gray-500">Add faculties and departments here...</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsFacultyModalOpen(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <PlusOutlined />
                            Add Faculty
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <CustomTable<Faculty>
                        columns={facultyColumns}
                        data={faculties}
                        loading={loading}
                    />
                </div>
            </div>

            <Modal
                title="Add Faculty"
                open={isFacultyModalOpen}
                onOk={handleAddFaculty}
                confirmLoading={isSubmitting}
                onCancel={() => setIsFacultyModalOpen(false)}
                okText="Add"
            >
                <Form form={facultyForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Faculty Name"
                        rules={[{ required: true, message: "Please enter faculty name" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Faculty"
                open={isEditFacultyModalOpen}
                onOk={handleUpdateFaculty}
                confirmLoading={isSubmitting}
                onCancel={() => {
                    setIsEditFacultyModalOpen(false);
                    setEditingFaculty(null);
                    editFacultyForm.resetFields();
                }}
                okText="Update"
            >
                <Form form={editFacultyForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Faculty Name"
                        rules={[{ required: true, message: "Please enter faculty name" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Add Department"
                open={isDeptModalOpen}
                onOk={handleAddDepartment}
                confirmLoading={isSubmitting}
                onCancel={() => {
                    setIsDeptModalOpen(false);
                    deptForm.resetFields();
                    setSelectedFacultyId(null);
                }}
                okText="Add"
            >
                <Form form={deptForm} layout="vertical">
                    <Form.Item name="facultyId" hidden initialValue={selectedFacultyId}>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Department Name"
                        rules={[{ required: true, message: "Please enter department name" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Department"
                open={isEditDeptModalOpen}
                onOk={handleUpdateDepartment}
                confirmLoading={isSubmitting}
                onCancel={() => {
                    setIsEditDeptModalOpen(false);
                    setEditingDepartment(null);
                    editDeptForm.resetFields();
                }}
                okText="Update"
            >
                <Form form={editDeptForm} layout="vertical">
                    <Form.Item name="facultyId" hidden>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Department Name"
                        rules={[{ required: true, message: "Please enter department name" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default AcademicDivisions;