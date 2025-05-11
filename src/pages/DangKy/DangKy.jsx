import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as userServices from "../../services/userSevices";
import './style.css';

const DangKy = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  // Regex patterns
  const USERNAME_REGEX = /^[a-zA-Z0-9@]{6,}$/;
  const PASSWORD_REGEX = /^.{6,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: ''
    };

    // Validate username
    if (!formData.username) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
      valid = false;
    } else if (!USERNAME_REGEX.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 6 ký tự và chỉ chứa chữ cái, số hoặc @';
      valid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      valid = false;
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      valid = false;
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const result = await userServices.registerUser(formData);
      // Xử lý đăng ký thành công
      alert(`Đăng ký thành công với tài khoản: ${formData.username}`);
      navigate('/');
    }
  };

  return (
    <div className="home-page">
      <div className="dangky-container">
        <h1 className="company-title">Blade & Soul</h1>
        <h2 className="login-title">Đăng ký tài khoản</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập (tối thiểu 6 ký tự)"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="divider"></div>
          <button type="submit" className="primary-button">Đăng ký</button>
        </form>
        <p className="register-link">
          Đã có tài khoản? <Link to="/">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default DangKy;