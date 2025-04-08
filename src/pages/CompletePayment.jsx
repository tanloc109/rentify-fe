import React, { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";

const CompletePayment = () => {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    const navigate = useNavigate();

    useEffect(() => {
        if (status === 'error' && message) {
            toast.error(decodeURIComponent(message));
        }
    }, [status, message]);

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center px-3">
            <div className="p-4" style={{ maxWidth: "600px", transform: "translateY(-20%)" }}>
                {status === "success" ? (
                    <>
                        <h1 className="display-4 fw-semibold">Cảm ơn quý khách!</h1>
                        <p className="fs-4 text-uppercase fw-semibold mt-3">
                            Vì đã chọn dịch vụ của chúng tôi
                        </p>
                        <Button
                            className="mt-4 w-100 py-2 text-uppercase rounded-0"
                            onClick={() => navigate("/quan-li-lich-tiem")}
                            style={{
                                letterSpacing: "0.5px",
                                backgroundColor: "transparent",
                                color: "black",
                                border: "1px solid black",
                                transition: "all 0.3s ease-in-out",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "black";
                                e.target.style.color = "white";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.color = "black";
                              }}
                        >
                            Đi đến trang quản lý lịch tiêm
                        </Button>
                    </>
                ) : (
                    <>
                        <h1 className="display-4 fw-semibold text-danger">Thanh toán thất bại!</h1>
                        <p className="fs-4 mt-3">{decodeURIComponent(message || "Có lỗi xảy ra. Vui lòng thử lại.")}</p>
                        <Button 
                            variant="danger" 
                            className="w-100 text-uppercase py-3 mt-2"
                            onClick={() => navigate("/dat-lich")}
                        >
                            Thử lại
                        </Button>
                        <Button 
                            variant="secondary" 
                            className="w-100 text-uppercase py-3 mt-2"
                            onClick={() => navigate("/")}
                        >
                            Quay về trang chủ
                        </Button>
                    </>
                )}
            </div>
        </Container>
    );
}

export default CompletePayment;
