import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import "./Contact.scss";

const Contact = () => {
    const center = {
        lat: 10.8360306,
        lng: 106.8427802,
    };

    return (
        <div className="contact-page">
            <div className="container">
                <h2 className="text-center">Liên hệ VaccineX - Cơ Sở Tiêm Chủng</h2>
                <p className="text-center">Địa chỉ: 79 Điện Biên Phủ, Bình Thạnh, TPHCM</p>

                <div className="contact-info">
                    <h4>Thông Tin Liên Hệ</h4>
                    <p><strong>Số điện thoại:</strong> +84 123 456 789</p>
                    <p><strong>Email:</strong> vaccinex@contact.com</p>
                    <p><strong>Giờ làm việc:</strong> 08:00 - 17:00 (Thứ Hai đến Thứ Sáu)</p>
                    <p><strong>Website:</strong> <a href="http://www.vacxinx.com" target="_blank" rel="noopener noreferrer">www.vaccinex.com</a></p>
                </div>

                <div className="contact-form">
                    <h4>Liên Hệ với Chúng Tôi</h4>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Họ và tên</label>
                            <input type="text" id="name" className="form-control" placeholder="Nhập họ và tên" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" className="form-control" placeholder="Nhập email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Lời nhắn</label>
                            <textarea id="message" className="form-control" rows="4" placeholder="Nhập lời nhắn" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Gửi</button>
                    </form>
                </div>

                <div className="map-container">
                    <h4 className="text-center">Bản đồ vị trí</h4>
                    {/* Nhúng bản đồ */}
                    {/* <LoadScript googleMapsApiKey="">
                        <GoogleMap
                            mapContainerStyle={{
                                height: '400px',
                                width: '100%',
                            }}
                            center={center}
                            zoom={16}
                        >
                            <Marker position={center} />
                        </GoogleMap>
                    </LoadScript> */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7764765186375!2d106.8427802!3d10.8360306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529322b312fb3%3A0xd6a3a05bd38a4d1d!2s79%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20Ph%E1%BB%A7%2C%20B%C3%ACnh%20Th%E1%BA%A1nh%2C%20TPHCM!5e0!3m2!1sen!2s!4v1646816820626"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;
