import React from "react";
import "./Home.scss";  // Đảm bảo bạn đã tạo file SCSS cho kiểu dáng
import { Link } from "react-router-dom";

const Home = () => {

    return (
        <div className="home-container" style={{ paddingBottom: '16.8vh' }}>
            <div className="home-banner">
                <h1>Chào Mừng Đến Với VaccineX</h1>
                <p>Đặt lịch tiêm chủng cho trẻ em, bảo vệ sức khỏe cho bé yêu của bạn ngay hôm nay!</p>
            </div>

            <div className="home-content">
                <div className="feature">
                    <h2>Tiêm Chủng Cho Trẻ Em</h2>
                    <p>
                        Cung cấp các dịch vụ tiêm chủng cho trẻ em từ sơ sinh đến 18 tuổi. Đảm bảo an toàn và hiệu quả với đội ngũ y bác sĩ chuyên nghiệp.
                    </p>
                </div>
                <div className="feature">
                    <h2>Đặt Lịch Tiêm Chủng</h2>
                    <p>
                        Đặt lịch tiêm chủng dễ dàng qua hệ thống trực tuyến của chúng tôi. Chọn ngày, loại vắc xin và giờ tiêm phù hợp với bạn.
                    </p>
                </div>
                <div className="feature">
                    <h2>Liên Hệ Với Chúng Tôi</h2>
                    <p>
                        Cần hỗ trợ? Liên hệ với chúng tôi để được tư vấn hoặc giải đáp thắc mắc.
                    </p>
                </div>
            </div>

            <div className="cta-section">
                <Link to="/dat-lich" style={{ textDecoration: 'none' }} className="cta-button">Đặt Lịch Ngay</Link>
            </div>
        </div>
    );
};

export default Home;
