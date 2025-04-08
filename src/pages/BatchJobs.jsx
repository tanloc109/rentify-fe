import React, { useContext, useState } from 'react';
import { UserContext } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Email as EmailIcon, 
  CalendarMonth as CalendarIcon,
  Inventory as InventoryIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

export const BatchJobPage = () => {
    const { user } = useContext(UserContext);
    const [loadingEmails, setLoadingEmails] = useState(false);
    const [loadingBatches, setLoadingBatches] = useState(false);

    const sendEmailToCustomersRemindAboutSchedules = async () => {
        try {
            setLoadingEmails(true);
            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/batch-jobs/reminders`,
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            if (response) {
                toast.success('Gửi mail đến khách hàng thành công.');
            }
        } catch (error) {
            console.log(error);
            toast.error('Gửi mail thất bại. Vui lòng thử lại sau.');
        } finally {
            setLoadingEmails(false);
        }
    }

    const assignBatchesToSchedule = async () => {
        try {
            setLoadingBatches(true);
            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_BASE_URL}/api/v1/batch-jobs/batch-assignment`,
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            if (response) {
                toast.success('Phân bổ lô vào lịch trong 2 tuần thành công');
            }
        } catch (error) {
            console.log(error);
            toast.error('Phân bổ lô thất bại. Vui lòng thử lại sau.');
        } finally {
            setLoadingBatches(false);
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom color="primary" 
                    sx={{ fontWeight: 600 }}>
                    Quản Lý Tác Vụ Định Kỳ
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
                    Kích hoạt các tác vụ thủ công để thực hiện các công việc định kỳ trong hệ thống
                </Typography>
                <Divider sx={{ my: 2 }} />
            </Paper>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card 
                        elevation={4} 
                        sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 8
                            }
                        }}
                    >
                        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: '#bbdefb' }}>
                            <EmailIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                            <Typography variant="h5" component="h2" color="primary">
                                Gửi Email Nhắc Nhở
                            </Typography>
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" paragraph>
                                Gửi email nhắc nhở tự động đến tất cả khách hàng về lịch trình của họ.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ScheduleIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Thao tác này thường được thực hiện hàng ngày vào lúc 07:00 sáng
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                fullWidth
                                color="primary"
                                startIcon={loadingEmails ? null : <EmailIcon />}
                                onClick={sendEmailToCustomersRemindAboutSchedules}
                                disabled={loadingEmails}
                            >
                                {loadingEmails ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Gửi Email Nhắc Nhở'
                                )}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card 
                        elevation={4} 
                        sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 8
                            }
                        }}
                    >
                        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: '#c8e6c9' }}>
                            <CalendarIcon sx={{ fontSize: 40, color: '#388e3c', mr: 2 }} />
                            <Typography variant="h5" component="h2" color="success.dark">
                                Phân Bổ Lô Vào Lịch
                            </Typography>
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" paragraph>
                                Tự động phân bổ các lô sản phẩm vào lịch trong hai tuần tới.
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <InventoryIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Thao tác này thường được thực hiện vào 02:00 mỗi ngày
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                fullWidth
                                color="success"
                                startIcon={loadingBatches ? null : <CalendarIcon />}
                                onClick={assignBatchesToSchedule}
                                disabled={loadingBatches}
                            >
                                {loadingBatches ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Phân Bổ Lô Vào Lịch'
                                )}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <Paper 
                elevation={2} 
                sx={{ 
                    p: 3, 
                    mt: 4, 
                    bgcolor: '#fffde7',
                    border: '1px dashed #ffc107'
                }}
            >
                <Typography variant="body2" color="text.secondary" align="center">
                    <strong>Lưu ý:</strong> Các tác vụ này thường được thực hiện tự động theo lịch trình. 
                    Chỉ sử dụng các nút này khi cần thiết kích hoạt thủ công cho mục đích kiểm thử hoặc trong trường hợp đặc biệt.
                </Typography>
            </Paper>
        </Container>
    );
}