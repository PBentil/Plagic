"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, message } from "antd";
import Layout from "@/app/components/Layout";
import { getStudentDashboardStats } from "@/app/student/services/student.service";

interface DashboardStats {
    totalCourses: number;
    totalAssignments: number;
    totalSubmissions: number;
    pendingSubmissions: number;
}

export default function StudentDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await getStudentDashboardStats();
            setStats(data);
        } catch (err) {
            console.error(err);
            message.error("Failed to load dashboard stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            {stats && (
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Card title="Courses Enrolled" bordered={false} className="text-center">
                            <span className="text-2xl font-bold">{stats.totalCourses}</span>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card title="Assignments" bordered={false} className="text-center">
                            <span className="text-2xl font-bold">{stats.totalAssignments}</span>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card title="Submissions" bordered={false} className="text-center">
                            <span className="text-2xl font-bold">{stats.totalSubmissions}</span>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card title="Pending Submissions" bordered={false} className="text-center">
                            <span className="text-2xl font-bold">{stats.pendingSubmissions}</span>
                        </Card>
                    </Col>
                </Row>
            )}
        </Layout>
    );
}
