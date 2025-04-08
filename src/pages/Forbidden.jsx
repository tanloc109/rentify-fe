import React from 'react';

const Forbidden = () => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #dc3545 0%, #6f42c1 100%)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* Main Content */}
      <div className="container d-flex flex-column justify-content-center align-items-center flex-grow-1 position-relative z-3 text-white text-center">
        <div className="position-relative my-4">
          <h1 className="display-1 fw-bold text-white opacity-25" style={{fontSize: "150px", position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)"}}>403</h1>
          <h2 className="display-4 fw-bold position-relative">Từ chối truy cập</h2>
        </div>
        
        <div className="my-4" style={{width: "100px", height: "4px", background: "rgba(255, 255, 255, 0.6)"}}></div>
        
        <p className="lead mb-5 col-md-8 mx-auto">
          Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại quyền hạn của tài khoản hoặc liên hệ với quản trị viên hệ thống.
        </p>
        
        <a href="/dang-nhap" className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-lg mb-5 fw-bold d-inline-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Quay lại trang đăng nhập
        </a>
      </div>

      {/* Wave SVG */}
      <div style={{position: "absolute", bottom: "0", left: "0", width: "100%"}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(255, 255, 255, 0.1)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,149.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Forbidden;