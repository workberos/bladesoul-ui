import { useReducer, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import mailService from "../../services/mailService";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "./style.css";
import {
  initialState,
  reducer,
  setField,
  setError,
  setSubmitting,
  setOTPSent,
  setOTPVerified,
  setResetModal,
  setCooldown,
  setSendingOTP,
  resetResetForm,
} from "../../reducers/dangNhapReducer";

const DangNhap = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // Cooldown for OTP
  useEffect(() => {
    let timer;
    if (state.cooldown > 0) {
      timer = setInterval(() => {
        dispatch(setCooldown(state.cooldown - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.cooldown]);

  // Đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(null));
    dispatch(setSubmitting(true));
    try {
      const data = await authService.signin(state.email, state.password);
      document.cookie = `authToken=${data.token}; path=/`;
      if (state.rememberMe) {
        localStorage.setItem(
          "rememberMe",
          JSON.stringify({ email: state.email, password: state.password })
        );
      } else {
        localStorage.removeItem("rememberMe");
      }
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại!";
      dispatch(setError(msg));
      toast.error(msg);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  // Hiện/ẩn mật khẩu
  const handleTogglePasswordVisibility = () => {
    dispatch(setField("showPassword", !state.showPassword));
  };

  // Gửi email quên mật khẩu
  const handleSendForgotPassword = async () => {
    dispatch(setSendingOTP(true));
    if (!state.resetEmail) {
      dispatch(setError("Vui lòng nhập email!"));
      dispatch(setSendingOTP(false));
      return;
    }
    try {
      await authService.sendForgotPassword(state.resetEmail);
      dispatch(setOTPSent(true));
      dispatch(setError(null));
      dispatch(setCooldown(60));
      toast.success("Đã gửi email khôi phục mật khẩu thành công!");
    } catch (err) {
      dispatch(setError("Không thể gửi email khôi phục mật khẩu!"));
      toast.error("Không thể gửi email khôi phục mật khẩu!");
    } finally {
      dispatch(setSendingOTP(false));
    }
  };

  // Xác thực OTP
  const handleVerifyOTP = async () => {
    try {
      const result = await mailService.verifyCode(
        state.resetEmail,
        state.resetOTP
      );
      if (result.success) {
        dispatch(setOTPVerified(true));
        dispatch(setError(null));
        toast.success("Xác thực OTP thành công!");
      } else {
        dispatch(setError("Mã OTP không chính xác!"));
        toast.error("Mã OTP không chính xác!");
      }
    } catch (err) {
      dispatch(setError("Mã OTP không chính xác hoặc đã hết hạn!"));
      toast.error("Mã OTP không chính xác hoặc đã hết hạn!");
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!state.isOTPVerified) {
      dispatch(setError("Vui lòng xác thực OTP trước!"));
      toast.error("Vui lòng xác thực OTP trước!");
      return;
    }
    if (!state.captchaToken) {
      dispatch(setError("Vui lòng xác nhận captcha!"));
      toast.error("Vui lòng xác nhận captcha!");
      return;
    }
    if (state.newPassword !== state.confirmNewPassword) {
      dispatch(setError("Mật khẩu mới và xác nhận mật khẩu không khớp!"));
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    if (state.newPassword.length < 6) {
      dispatch(setError("Mật khẩu mới phải có ít nhất 6 ký tự!"));
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    dispatch(setSubmitting(true));
    try {
      await mailService.resetPassword(
        state.resetEmail,
        state.newPassword,
        state.captchaToken
      );
      dispatch(setResetModal(false));
      dispatch(resetResetForm());
      toast.success("Đặt lại mật khẩu thành công!");
    } catch (err) {
      dispatch(setError("Đặt lại mật khẩu thất bại!"));
      toast.error("Đặt lại mật khẩu thất bại!");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleCloseResetModal = () => {
    dispatch(setResetModal(false));
    dispatch(resetResetForm());
  };

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
              value={state.email}
              onChange={(e) => dispatch(setField("email", e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-password-group">
              <input
                type={state.showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={state.password}
                onChange={(e) => dispatch(setField("password", e.target.value))}
                required
              />
              <span
                className="password-icon"
                onClick={handleTogglePasswordVisibility}
              >
                {state.showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="remember-forgot-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={state.rememberMe}
                  onChange={(e) =>
                    dispatch(setField("rememberMe", e.target.checked))
                  }
                />
                Ghi nhớ đăng nhập
              </label>
              <Link
                to="#"
                className="forgot-password"
                onClick={() => dispatch(setResetModal(true))}
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          <div className="form-group">
            <ReCAPTCHA
              sitekey="6LeJMI4qAAAAAMl3NjToCLJmx7uwGohGpVt7DDJ7"
              onChange={(token) => dispatch(setField("captchaToken", token))}
            />
          </div>
          <button
            type="submit"
            className="primary-button"
            disabled={state.isSubmitting || !state.captchaToken}
          >
            {state.isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>
          {state.error && <p className="signin-error">{state.error}</p>}
        </form>
        <p className="register-link">
          Bạn chưa có tài khoản? <Link to="/dang-ky">Tạo tài khoản</Link>
        </p>
      </div>
      {/* Modal Quên Mật Khẩu */}
      {state.isResetPasswordModalOpen && (
        <div className="signin-forgot-password-modal-overlay">
          <div className="signin-forgot-password-modal">
            <div className="forgot-password-header">
              <h2 className="forgot-password-title">Quên Mật Khẩu</h2>
              <button
                className="change-password-close-button"
                onClick={handleCloseResetModal}
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={handleResetPassword}
              className="forgot-password-form"
            >
              <div className="forgot-password-input-group">
                <input
                  type="email"
                  className="forgot-password-input"
                  placeholder="Nhập email của bạn"
                  value={state.resetEmail}
                  onChange={(e) =>
                    dispatch(setField("resetEmail", e.target.value))
                  }
                  disabled={state.isOTPSent}
                  required
                />
              </div>
              <div className="forgot-password-otp-section">
                <button
                  type="button"
                  className="forgot-password-otp-button"
                  onClick={handleSendForgotPassword}
                  disabled={
                    state.cooldown > 0 ||
                    state.isOTPVerified ||
                    !state.resetEmail
                  }
                >
                  {state.isSendingOTP ? (
                    <span className="loading-spinner"></span>
                  ) : state.cooldown > 0 ? (
                    `Gửi lại (${state.cooldown}s)`
                  ) : (
                    "Gửi email khôi phục"
                  )}
                </button>
                {state.isOTPSent && !state.isOTPVerified && (
                  <div className="forgot-password-input-group">
                    <input
                      type="text"
                      className="forgot-password-input"
                      placeholder="Nhập mã OTP"
                      value={state.resetOTP}
                      onChange={(e) =>
                        dispatch(setField("resetOTP", e.target.value))
                      }
                      maxLength={6}
                    />
                    <button
                      type="button"
                      className="forgot-password-otp-button"
                      onClick={handleVerifyOTP}
                      disabled={state.resetOTP.length !== 6}
                    >
                      Xác nhận OTP
                    </button>
                  </div>
                )}
                {state.isOTPVerified && (
                  <div className="forgot-password-verified-badge">
                    <FaCheckCircle /> Xác thực thành công
                  </div>
                )}
              </div>
              {state.isOTPVerified && (
                <>
                  <div className="forgot-password-input-group">
                    <input
                      type={state.showNewPassword ? "text" : "password"}
                      className="forgot-password-input"
                      placeholder="Mật khẩu mới"
                      value={state.newPassword}
                      onChange={(e) =>
                        dispatch(setField("newPassword", e.target.value))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="forgot-password-password-toggle"
                      onClick={() =>
                        dispatch(
                          setField("showNewPassword", !state.showNewPassword)
                        )
                      }
                    >
                      {state.showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="forgot-password-input-group">
                    <input
                      type={state.showConfirmNewPassword ? "text" : "password"}
                      className="forgot-password-input"
                      placeholder="Xác nhận mật khẩu mới"
                      value={state.confirmNewPassword}
                      onChange={(e) =>
                        dispatch(setField("confirmNewPassword", e.target.value))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="forgot-password-password-toggle"
                      onClick={() =>
                        dispatch(
                          setField(
                            "showConfirmNewPassword",
                            !state.showConfirmNewPassword
                          )
                        )
                      }
                    >
                      {state.showConfirmNewPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                  <div className="forgot-password-captcha">
                    <ReCAPTCHA
                      sitekey="6LeJMI4qAAAAAMl3NjToCLJmx7uwGohGpVt7DDJ7"
                      onChange={(token) =>
                        dispatch(setField("captchaToken", token))
                      }
                    />
                  </div>
                </>
              )}
              <div className="forgot-password-actions">
                <button
                  type="button"
                  className="forgot-password-cancel-button"
                  onClick={handleCloseResetModal}
                >
                  Hủy
                </button>
                {state.isOTPVerified && (
                  <button
                    type="submit"
                    className="forgot-password-submit-button"
                    disabled={state.isSubmitting || !state.captchaToken}
                  >
                    {state.isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                  </button>
                )}
              </div>
              {state.error && <p className="signin-error">{state.error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangNhap;
