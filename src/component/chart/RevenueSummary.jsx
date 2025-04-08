"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, Typography, Skeleton, Box, Stack } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RefundIcon from "@mui/icons-material/Replay";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { getRevenueData } from "../../services/chartService";

const RevenueSummary = ({ accessToken }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getRevenueData(accessToken);
            if (result) {
                setData(result);
            }
            setLoading(false);
        };
        fetchData();
    }, [accessToken]);

    if (loading) {
        return <Skeleton variant="rectangular" width="100%" height={400} />;
    }

    if (!data) {
        return <Typography color="error">Không có dữ liệu.</Typography>;
    }

    const { grossRevenue, netRevenue, totalRefund, totalOrders, revenueChangePercentage, monthlyData } = data;

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardHeader title={<Typography variant="h6" fontWeight="bold">📊 Thống kê doanh thu</Typography>} />
            <CardContent>
                <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                    <SummaryBox icon={<MonetizationOnIcon />} title="Doanh thu trước hoàn" value={grossRevenue} color="#10B981" />
                    <SummaryBox icon={<RefundIcon />} title="Tổng tiền hoàn trả" value={totalRefund} color="#EF4444" />
                    <SummaryBox icon={<ReceiptIcon />} title="Doanh thu thực tế" value={netRevenue} color="#4B5563" />
                    <SummaryBox 
                        icon={revenueChangePercentage >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        title="Tăng trưởng tháng" 
                        value={`${revenueChangePercentage}%`} 
                        color={revenueChangePercentage >= 0 ? "#10B981" : "#EF4444"} 
                    />
                </Stack>

                {/* Biểu đồ cột */}
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>📊 Doanh thu hàng tháng</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="grossRevenue" fill="#10B981" name="Doanh thu" />
                        <Bar dataKey="refund" fill="#EF4444" name="Hoàn tiền" />
                    </BarChart>
                </ResponsiveContainer>

                {/* Biểu đồ đường */}
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>📈 Tăng trưởng doanh thu</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={revenueChangePercentage >= 0 ? "#10B981" : "#EF4444"} 
                            strokeWidth={2} 
                            dot={{ r: 5 }} 
                            name="Tăng trưởng doanh thu" 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

const SummaryBox = ({ icon, title, value, color }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2.5,
                borderRadius: 2.5,
                bgcolor: `${color}10`,
                boxShadow: 1,
                minWidth: 140,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 2,
                },
            }}
        >
            <Box sx={{ bgcolor: `${color}20`, p: 1.5, borderRadius: "50%", mb: 1.5 }}>
                {React.cloneElement(icon, { sx: { fontSize: 34, color: color } })}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: color }}>{value}</Typography>
        </Box>
    );
};

export default RevenueSummary;
