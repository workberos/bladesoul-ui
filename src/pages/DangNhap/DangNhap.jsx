import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './style.css';

const DangNhap = () =>{
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    
    alert(`Đăng nhập thành công với email: ${email}`);
    navigate('/'); // Chuyển về trang chủ sau khi đăng nhập
  };
  console.log(import.meta.env.VITE_API_URL)
  return (
    <div className="home-page">
      <div className="dangnhap-container">
        <h1 className="company-title">Blade & Soul</h1>
        <h2 className="login-title">Đăng nhập hệ thống</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Vui lòng nhập địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to="/quen-mat-khau" className="forgot-password">Quên mật khẩu?</Link>
          </div>

          <div className="divider"></div>
          <button type="submit" className="primary-button">Đăng nhập</button>
        </form>
        <p className="register-link">
          Bạn chưa có tài khoản? <Link to="/dang-ky">Tạo tài khoản</Link>;
        </p>
      </div>
    </div>
  );
}

export default DangNhap;