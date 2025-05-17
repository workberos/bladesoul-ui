import { Link } from "react-router-dom";
import '../assets/css/Navbar.css'
import { useState } from "react";

const Navbar = () => {
  const {isLoggin} = useState(false);
  return (
    <nav className="game-navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">
          <span className="logo-text">Blade & Soul</span>
          <span className="logo-border"></span>
        </Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <span className="link-text">Trang chủ</span>
          <span className="link-underline"></span>
        </Link>
        <Link to="/nap-tien" className="nav-link">
          <span className="link-text">Nạp tiền</span>
          <span className="link-underline"></span>
        </Link>
        <Link to="/ho-tro" className="nav-link">
          <span className="link-text">Hỗ trợ</span>
          <span className="link-underline"></span>
        </Link>
        <Link to="/dang-nhap" className="nav-link">
          <span className="link-text">{!isLoggin? "Đăng nhập" : "Chào, bạn"}</span>
          <span className="link-underline"></span>
        </Link>
        <div className="nav-link download-btn" onClick={() => alert("Bắt đầu tải game...")}>
          <span className="link-text">Tải game</span>
          <span className="pulse-effect"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;