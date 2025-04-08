"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, Typography, Skeleton, Box, Stack } from "@mui/material";
import PaidIcon from "@mui/icons-material/AttachMoney";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getOrderSummary } from "../../services/chartService";

const OrderSummaryChart = ({ accessToken }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getOrderSummary(accessToken);
            if (result) {
                setData([
                    { name: "Tổng cộng", value: result.total, color: "#4B5563" },
                    { name: "Đã thanh toán", value: result.paid, color: "#10B981" },
                    { name: "Đã hủy đơn", value: result.cancelled, color: "#EF4444" }
                ]);
            }
            setLoading(false);
        };
        fetchData();
    }, [accessToken]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const total = data[0].value;
            const percentage = ((payload[0].value / total) * 100).toFixed(1);
            return (
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        p: 1.5,
                        borderRadius: 2,
                        boxShadow: 3,
                        border: "none",
                    }}
                >
                    <Typography variant="body2" fontWeight="bold" mb={0.5}>
                        {payload[0].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Số lượng: {payload[0].value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tỷ lệ: {percentage}%
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.1)',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
        }}>
            <CardHeader
                title={<Typography variant="h6" fontWeight="bold">📊 Tổng quan đơn đăng ký tiêm</Typography>}
                sx={{ pb: 1 }}
            />
            <CardContent>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                    <>
                        <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                            <SummaryBox
                                icon={<ShoppingCartIcon />}
                                title="Tổng cộng"
                                value={data[0]?.value}
                                color={data[0]?.color}
                            />
                            {data.slice(1).map((item, index) => (
                                <SummaryBox
                                    key={index}
                                    icon={index === 0 ? <PaidIcon /> : <CancelIcon />}
                                    title={item.name}
                                    value={`${((item.value / data[0].value) * 100).toFixed(1)}%`}
                                    color={item.color}
                                />
                            ))}
                        </Stack>

                        <Box sx={{ position: 'relative', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.slice(1)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="60%"
                                        outerRadius="80%"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.slice(1).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Hiển thị tổng số ở giữa biểu đồ */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="h4" fontWeight="bold" color={data[0]?.color}>
                                    {data[0]?.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tổng đơn
                                </Typography>
                            </Box>
                        </Box>


                    </>
                )}
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
            <Box
                sx={{
                    bgcolor: `${color}20`,
                    p: 1.5,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                }}
            >
                {React.cloneElement(icon, {
                    sx: {
                        fontSize: 34,
                        color: color,
                    }
                })}
            </Box>
            <Typography variant="body2" sx={{
                fontWeight: 600,
                mb: 0.5,
                color: "text.secondary",
                textAlign: 'center'
            }}>
                {title}
            </Typography>
            <Typography variant="h5" sx={{
                fontWeight: 700,
                color: color,
            }}>
                {value}
            </Typography>
        </Box>
    );
};

export default OrderSummaryChart;