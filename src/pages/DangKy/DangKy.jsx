import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import mailService from '../../services/mailService';
import accountAvailabilityService from '../../services/accountAvailabilityService';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './style.css';

const DangKy = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(''));
  const [cooldown, setCooldown] = useState(0);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const USERNAME_REGEX = /^[a-zA-Z0-9@]{6,}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^.{6,}$/;

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1];
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const togglePasswordVisibility = () => setShowPassword((v) => !v);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((v) => !v);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trimStart() });
    setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    let error = '';
    if (value) {
      if (name === 'username') {
        if (!USERNAME_REGEX.test(value)) {
          error = 'Tên đăng nhập phải có ít nhất 6 ký tự và chỉ chứa chữ cái, số hoặc @';
        } else {
          try {
            const taken = await accountAvailabilityService.checkAccountNameAvailability(value);
            if (taken) error = 'Tên tài khoản đã tồn tại.';
          } catch {
            error = 'Đã xảy ra lỗi khi kiểm tra tên tài khoản.';
          }
        }
      } else if (name === 'email') {
        if (!EMAIL_REGEX.test(value)) {
          error = 'Vui lòng nhập email hợp lệ.';
        } else {
          try {
            const taken = await accountAvailabilityService.checkEmailAvailability(value);
            if (taken) error = 'Email đã tồn tại.';
          } catch {
            error = 'Đã xảy ra lỗi khi kiểm tra email.';
          }
        }
      } else if (name === 'password' && !PASSWORD_REGEX.test(value)) {
        error = 'Mật khẩu phải có ít nhất 6 ký tự.';
      } else if (name === 'confirmPassword' && value !== formData.password) {
        error = 'Mật khẩu xác nhận không khớp.';
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    const newErrors = {};
    if (!USERNAME_REGEX.test(username)) newErrors.username = 'Tên đăng nhập phải có ít nhất 6 ký tự và chỉ chứa chữ cái, số hoặc @';
    if (!EMAIL_REGEX.test(email)) newErrors.email = 'Vui lòng nhập email hợp lệ.';
    if (!PASSWORD_REGEX.test(password)) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    if (!recaptchaValue) newErrors.recaptcha = 'Vui lòng xác minh reCAPTCHA.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerification = async () => {
    setLoading(true);
    setResendLoading(true);
    try {
      await mailService.sendVerificationEmail(formData.email);
      toast.success('Mã xác nhận đã được gửi đến email của bạn.');
      setIsVerificationSent(true);
      startCooldown();
    } catch {
      toast.error('Không thể gửi mã xác nhận. Vui lòng thử lại.');
    } finally {
      setResendLoading(false);
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCodeChange = (e, idx) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]$/.test(value) || value === '') {
      const newCode = [...verificationCode];
      newCode[idx] = value;
      setVerificationCode(newCode);
      if (value && idx < 5) {
        document.getElementById(`code-${idx + 1}`).focus();
      }
    }
    if (e.key === 'Backspace' && !value && idx > 0) {
      const newCode = [...verificationCode];
      newCode[idx - 1] = '';
      setVerificationCode(newCode);
      document.getElementById(`code-${idx - 1}`).focus();
    }
  };

  const handleVerifyCode = async () => {
    try {
      const code = verificationCode.join('');
      await mailService.verifyCode(formData.email, code);
      await handleSignup();
    } catch {
      toast.error('Mã xác nhận không hợp lệ. Vui lòng thử lại.');
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await authService.signup(formData.username, formData.email, formData.password);
      toast.success('Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.');
      setTimeout(() => navigate('/'), 2000);
    } catch {
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaValue) {
      toast.error('Vui lòng xác minh reCAPTCHA trước khi tạo tài khoản.');
      return;
    }
    if (!validateForm()) return;
    const isAccountNameTaken = await accountAvailabilityService.checkAccountNameAvailability(formData.username);
    const isEmailTaken = await accountAvailabilityService.checkEmailAvailability(formData.email);
    if (isAccountNameTaken) {
      toast.error('Tên tài khoản đã tồn tại.');
      return;
    }
    if (isEmailTaken) {
      toast.error('Email đã tồn tại.');
      return;
    }
    await handleSendVerification();
  };

  return (
    <div className="home-page">
      <div className="dangky-container">
        <h1 className="company-title">Blade & Soul</h1>
        <h2 className="login-title">{isVerificationSent ? 'Nhập Mã Xác Nhận' : 'Đăng ký tài khoản'}</h2>
        {!isVerificationSent ? (
          <RegisterForm
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            loading={loading}
            recaptchaValue={recaptchaValue}
            handleChange={handleChange}
            handleBlur={handleBlur}
            togglePasswordVisibility={togglePasswordVisibility}
            toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
            setRecaptchaValue={setRecaptchaValue}
            handleSubmit={handleSubmit}
          />
        ) : (
          <VerificationForm
            verificationCode={verificationCode}
            handleCodeChange={handleCodeChange}
            handleVerifyCode={handleVerifyCode}
            handleSendVerification={handleSendVerification}
            cooldown={cooldown}
            resendLoading={resendLoading}
          />
        )}
        {!isVerificationSent && (
          <p className="register-link">
            Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập ngay</Link>
          </p>
        )}
      </div>
    </div>
  );
};

function RegisterForm({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  loading,
  recaptchaValue,
  handleChange,
  handleBlur,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  setRecaptchaValue,
  handleSubmit
}) {
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input
          type="text"
          name="username"
          placeholder="Nhập tên đăng nhập (tối thiểu 6 ký tự)"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.username ? 'error' : ''}
        />
        {errors.username && <span className="error-message">{errors.username}</span>}
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Mật khẩu</label>
        <div className="input-password-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password ? 'error' : ''}
          />
          <span className="password-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>
      <div className="form-group">
        <label>Xác nhận mật khẩu</label>
        <div className="input-password-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.confirmPassword ? 'error' : ''}
          />
          <span className="password-icon" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>
      <div className="form-group">
        <ReCAPTCHA
          sitekey="6LeJMI4qAAAAAMl3NjToCLJmx7uwGohGpVt7DDJ7"
          onChange={setRecaptchaValue}
        />
        {errors.recaptcha && <span className="error-message">{errors.recaptcha}</span>}
      </div>
      <button type="submit" className="primary-button" disabled={loading || !recaptchaValue}>
        {loading ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
    </form>
  );
}

function VerificationForm({
  verificationCode,
  handleCodeChange,
  handleVerifyCode,
  handleSendVerification,
  cooldown,
  resendLoading
}) {
  return (
    <div className="verification-container">
      <div className="code-inputs">
        {verificationCode.map((code, idx) => (
          <input
            key={idx}
            id={`code-${idx}`}
            type="text"
            maxLength="1"
            value={code}
            onChange={(e) => handleCodeChange(e, idx)}
            onKeyDown={(e) => handleCodeChange(e, idx)}
            className="code-input"
            autoComplete="off"
          />
        ))}
      </div>
      <button onClick={handleVerifyCode} className="verification-button">
        Xác Nhận
      </button>
      <p
        onClick={cooldown === 0 ? handleSendVerification : null}
        style={{ cursor: cooldown > 0 ? 'not-allowed' : 'pointer', color: cooldown > 0 ? 'gray' : 'black' }}
      >
        {resendLoading ? 'Đang gửi lại...' : cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : 'Gửi lại mã xác nhận'}
      </p>
    </div>
  );
}

export default DangKy;