/* eslint-disable no-unused-vars */
import { useReducer, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimes } from "react-icons/fa"
import { toast } from "react-toastify"
import authService from "../../services/authService"
import mailService from "../../services/mailService"
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
} from "../../reducers/dangNhapReducer"
import "./style.css"

export default function Login() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1]
    if (token) {
      navigate("/")
    }
  }, [navigate])

  // Cooldown for OTP
  useEffect(() => {
    let timer
    if (state.cooldown > 0) {
      timer = setInterval(() => {
        dispatch(setCooldown(state.cooldown - 1))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [state.cooldown])

  // Login handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setError(null))
    dispatch(setSubmitting(true))
    try {
      const data = await authService.signin(state.username, state.password, state.secondaryPassword)
      document.cookie = `authToken=${data.token}; path=/`
      if (state.rememberMe) {
        localStorage.setItem(
          "rememberMe",
          JSON.stringify({
            username: state.username,
            password: state.password,
            secondaryPassword: state.secondaryPassword,
          }),
        )
      } else {
        localStorage.removeItem("rememberMe")
      }
      toast.success("Đăng nhập thành công!")
      navigate("/")
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại!"
      dispatch(setError(msg))
      toast.error(msg)
    } finally {
      dispatch(setSubmitting(false))
    }
  }

  // Send password reset email
  const handleSendForgotPassword = async () => {
    dispatch(setSendingOTP(true))
    if (!state.resetUsername) {
      dispatch(setError("Vui lòng nhập tên đăng nhập!"))
      dispatch(setSendingOTP(false))
      return
    }
    try {
      await authService.sendForgotPassword(state.resetUsername)
      dispatch(setOTPSent(true))
      dispatch(setError(null))
      dispatch(setCooldown(60))
      toast.success("Đã gửi khôi phục mật khẩu thành công!")
    } catch (err) {
      dispatch(setError("Không thể gửi khôi phục mật khẩu!"))
      toast.error("Không thể gửi khôi phục mật khẩu!")
    } finally {
      dispatch(setSendingOTP(false))
    }
  }

  // Verify OTP
  const handleVerifyOTP = async () => {
    try {
      const result = await mailService.verifyCode(state.resetUsername, state.resetOTP)
      if (result.success) {
        dispatch(setOTPVerified(true))
        dispatch(setError(null))
        toast.success("Xác thực OTP thành công!")
      } else {
        dispatch(setError("Mã OTP không chính xác!"))
        toast.error("Mã OTP không chính xác!")
      }
    } catch (err) {
      dispatch(setError("Mã OTP không chính xác hoặc đã hết hạn!"))
      toast.error("Mã OTP không chính xác hoặc đã hết hạn!")
    }
  }

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!state.isOTPVerified) {
      dispatch(setError("Vui lòng xác thực OTP trước!"))
      toast.error("Vui lòng xác thực OTP trước!")
      return
    }
    if (!state.resetSecondaryPassword) {
      dispatch(setError("Vui lòng nhập mật khẩu cấp 2!"))
      toast.error("Vui lòng nhập mật khẩu cấp 2!")
      return
    }
    if (state.newPassword !== state.confirmNewPassword) {
      dispatch(setError("Mật khẩu mới và xác nhận mật khẩu không khớp!"))
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!")
      return
    }
    if (state.newPassword.length < 6) {
      dispatch(setError("Mật khẩu mới phải có ít nhất 6 ký tự!"))
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!")
      return
    }
    dispatch(setSubmitting(true))
    try {
      await authService.resetPassword(state.resetUsername, state.resetSecondaryPassword, state.newPassword)
      dispatch(setResetModal(false))
      dispatch(resetResetForm())
      toast.success("Đặt lại mật khẩu thành công!")
    } catch (err) {
      dispatch(setError("Đặt lại mật khẩu thất bại!"))
      toast.error("Đặt lại mật khẩu thất bại!")
    } finally {
      dispatch(setSubmitting(false))
    }
  }

  const handleCloseResetModal = () => {
    dispatch(setResetModal(false))
    dispatch(resetResetForm())
  }

  return (
    <div className="game-auth-container">
      <div className="game-auth-card">
        <div className="game-logo">
          <h1>Blade & Soul</h1>
        </div>

        <div className="game-auth-content">
          <h2 className="game-auth-title">
            <span className="text-primary">Đăng nhập</span> hệ thống
          </h2>

          <form onSubmit={handleSubmit} className="game-auth-form">
            <div className="form-field">
              <label className="form-label">Tên đăng nhập</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Vui lòng nhập tên đăng nhập"
                  value={state.username}
                  onChange={(e) => dispatch(setField("username", e.target.value))}
                  required
                  className="game-input"
                />
                <div className="input-border"></div>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Mật khẩu cấp 1</label>
              <div className="input-wrapper">
                <input
                  type={state.showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu cấp 1"
                  value={state.password}
                  onChange={(e) => dispatch(setField("password", e.target.value))}
                  required
                  className="game-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => dispatch(setField("showPassword", !state.showPassword))}
                >
                  {state.showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <div className="input-border"></div>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Mật khẩu cấp 2</label>
              <div className="input-wrapper">
                <input
                  type={state.showSecondaryPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu cấp 2"
                  value={state.secondaryPassword}
                  onChange={(e) => dispatch(setField("secondaryPassword", e.target.value))}
                  required
                  className="game-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => dispatch(setField("showSecondaryPassword", !state.showSecondaryPassword))}
                >
                  {state.showSecondaryPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <div className="input-border"></div>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={state.rememberMe}
                  onChange={(e) => dispatch(setField("rememberMe", e.target.checked))}
                  className="game-checkbox"
                />
                <span className="checkmark"></span>
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="forgot-link" onClick={() => dispatch(setResetModal(true))}>
                Quên mật khẩu?
              </button>
            </div>

            {state.error && <div className="error-message">{state.error}</div>}

            <button type="submit" className="game-button primary-button" disabled={state.isSubmitting}>
              {state.isSubmitting ? <span className="loading-spinner"></span> : "Đăng nhập"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Bạn chưa có tài khoản?
              <Link to="/dang-ky" className="register-link">
                <span className="text-secondary"> Tạo tài khoản</span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {state.isResetPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="game-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                <span className="text-primary">Quên</span> Mật Khẩu
              </h3>
              <button className="modal-close" onClick={handleCloseResetModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="modal-content">
              <div className="form-field">
                <label className="form-label">Tên đăng nhập</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập của bạn"
                    value={state.resetUsername}
                    onChange={(e) => dispatch(setField("resetUsername", e.target.value))}
                    disabled={state.isOTPSent}
                    required
                    className="game-input"
                  />
                  <div className="input-border"></div>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Mật khẩu cấp 2</label>
                <div className="input-wrapper">
                  <input
                    type={state.showSecondaryPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu cấp 2"
                    value={state.resetSecondaryPassword}
                    onChange={(e) => dispatch(setField("resetSecondaryPassword", e.target.value))}
                    required
                    className="game-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => dispatch(setField("showSecondaryPassword", !state.showSecondaryPassword))}
                  >
                    {state.showSecondaryPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <div className="input-border"></div>
                </div>
              </div>

              <div className="otp-section">
                <button
                  type="button"
                  className={`game-button ${state.cooldown > 0 ? "disabled" : "secondary-button"}`}
                  onClick={handleSendForgotPassword}
                  disabled={state.cooldown > 0 || !state.resetUsername || !state.resetSecondaryPassword}
                >
                  {state.isSendingOTP ? (
                    <span className="loading-spinner"></span>
                  ) : state.cooldown > 0 ? (
                    `Gửi lại (${state.cooldown}s)`
                  ) : (
                    "Gửi khôi phục"
                  )}
                </button>

                {state.isOTPSent && !state.isOTPVerified && (
                  <div className="otp-verify">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="game-input otp-input"
                        placeholder="Nhập mã OTP"
                        value={state.resetOTP}
                        onChange={(e) => dispatch(setField("resetOTP", e.target.value))}
                        maxLength={6}
                      />
                      <div className="input-border"></div>
                    </div>
                    <button
                      type="button"
                      className="game-button accent-button"
                      onClick={handleVerifyOTP}
                      disabled={state.resetOTP.length !== 6}
                    >
                      Xác nhận OTP
                    </button>
                  </div>
                )}

                {state.isOTPVerified && (
                  <div className="verified-badge">
                    <FaCheckCircle className="text-success" />
                    <span>Xác thực thành công</span>
                  </div>
                )}
              </div>

              {state.isOTPVerified && (
                <>
                  <div className="form-field">
                    <label className="form-label">Mật khẩu mới</label>
                    <div className="input-wrapper">
                      <input
                        type={state.showNewPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        value={state.newPassword}
                        onChange={(e) => dispatch(setField("newPassword", e.target.value))}
                        required
                        className="game-input"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => dispatch(setField("showNewPassword", !state.showNewPassword))}
                      >
                        {state.showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <div className="input-border"></div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Xác nhận mật khẩu mới</label>
                    <div className="input-wrapper">
                      <input
                        type={state.showConfirmNewPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu mới"
                        value={state.confirmNewPassword}
                        onChange={(e) => dispatch(setField("confirmNewPassword", e.target.value))}
                        required
                        className="game-input"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => dispatch(setField("showConfirmNewPassword", !state.showConfirmNewPassword))}
                      >
                        {state.showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <div className="input-border"></div>
                    </div>
                  </div>
                </>
              )}

              {state.error && <div className="error-message">{state.error}</div>}

              <div className="modal-actions">
                <button type="button" className="game-button outline-button" onClick={handleCloseResetModal}>
                  Hủy
                </button>

                {state.isOTPVerified && (
                  <button type="submit" className="game-button primary-button" disabled={state.isSubmitting}>
                    {state.isSubmitting ? <span className="loading-spinner"></span> : "Xác nhận"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
