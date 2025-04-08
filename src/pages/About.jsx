import React from 'react';
import './About.scss';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>Về Chúng Tôi</h1>
                <p>Chào mừng bạn đến với <strong>VaccineX</strong> – Cơ sở tiêm chủng uy tín và chất lượng tại TP.HCM.</p>
            </div>
            <div className="about-content">
                <section className="mission">
                    <h2>Sứ Mệnh Của Chúng Tôi</h2>
                    <p>
                        Chúng tôi cam kết cung cấp dịch vụ tiêm chủng chất lượng cao, giúp bảo vệ sức khỏe cộng đồng và ngăn ngừa bệnh truyền nhiễm.
                    </p>
                </section>
                <section className="why-choose">
                    <h2>Tại Sao Lựa Chọn VaccineX?</h2>
                    <ul>
                        <li><strong>Đội Ngũ Chuyên Gia:</strong> Y bác sĩ giàu kinh nghiệm, chăm sóc tận tâm.</li>
                        <li><strong>Vị Trí Tiện Lợi:</strong> 79 Điện Biên Phủ, Bình Thạnh, TPHCM.</li>
                        <li><strong>Dịch Vụ Đa Dạng:</strong> Tiêm chủng cho mọi đối tượng và các vắc xin cho du lịch quốc tế.</li>
                        <li><strong>Đặt Lịch Dễ Dàng:</strong> Hệ thống đặt lịch trực tuyến nhanh chóng và tiện lợi.</li>
                    </ul>
                </section>
                <section className="contact">
                    <h2>Liên Hệ Với Chúng Tôi</h2>
                    <p>Để biết thêm chi tiết hoặc đặt lịch, vui lòng liên hệ với chúng tôi qua:</p>
                    <ul>
                        <li>Email: <a href="mailto:info@vaccinex.com">info@vaccinex.com</a></li>
                        <li>Điện thoại: 0123456789</li>
                        <li>Địa chỉ: 79 Điện Biên Phủ, Bình Thạnh, TPHCM</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default About;
