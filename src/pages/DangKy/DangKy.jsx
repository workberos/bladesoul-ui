import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { toast } from "react-toastify"
import "../DangNhap/style.css"
import authService from "../../services/authService"
import mailService from "../../services/mailService"
import accountAvailabilityService from "../../services/accountAvailabilityService"

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    secondaryPassword: "",
    confirmSecondaryPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""))
  const [cooldown, setCooldown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const navigate = useNavigate()

  const USERNAME_REGEX = /^[a-zA-Z0-9@]{6,}$/
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const PASSWORD_REGEX = /^.{6,}$/

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1]
    if (token) {
      navigate("/")
    }
  }, [navigate])

  const togglePasswordVisibility = () => setShowPassword((v) => !v)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((v) => !v)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value.trimStart() })
    setErrors({ ...errors, [name]: "" })
  }

  const handleBlur = async (e) => {
    const { name, value } = e.target
    let error = ""
    if (value) {
      if (name === "username") {
        if (!USERNAME_REGEX.test(value)) {
          error = "Tên đăng nhập phải có ít nhất 6 ký tự và chỉ chứa chữ cái, số hoặc @"
        } else {
          try {
            const taken = await accountAvailabilityService.checkAccountNameAvailability(value)
            if (taken) error = "Tên tài khoản đã tồn tại."
          } catch {
            error = "Đã xảy ra lỗi khi kiểm tra tên tài khoản."
          }
        }
      } else if (name === "email") {
        if (!EMAIL_REGEX.test(value)) {
          error = "Vui lòng nhập email hợp lệ."
        } else {
          try {
            const taken = await accountAvailabilityService.checkEmailAvailability(value)
            if (taken) error = "Email đã tồn tại."
          } catch {
            error = "Đã xảy ra lỗi khi kiểm tra email."
          }
        }
      } else if (name === "password" && !PASSWORD_REGEX.test(value)) {
        error = "Mật khẩu phải có ít nhất 6 ký tự."
      } else if (name === "confirmPassword" && value !== formData.password) {
        error = "Mật khẩu xác nhận không khớp."
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const validateForm = () => {
    const { username, email, password, confirmPassword, secondaryPassword, confirmSecondaryPassword } = formData
    const newErrors = {}
    if (!USERNAME_REGEX.test(username))
      newErrors.username = "Tên đăng nhập phải có ít nhất 6 ký tự và chỉ chứa chữ cái, số hoặc @"
    if (!EMAIL_REGEX.test(email)) newErrors.email = "Vui lòng nhập email hợp lệ."
    if (!PASSWORD_REGEX.test(password)) newErrors.password = "Mật khẩu cấp 1 phải có ít nhất 6 ký tự."
    if (password !== confirmPassword) newErrors.confirmPassword = "Mật khẩu cấp 1 xác nhận không khớp."
    if (!PASSWORD_REGEX.test(secondaryPassword)) newErrors.secondaryPassword = "Mật khẩu cấp 2 phải có ít nhất 6 ký tự."
    if (secondaryPassword !== confirmSecondaryPassword)
      newErrors.confirmSecondaryPassword = "Mật khẩu cấp 2 xác nhận không khớp."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendVerification = async () => {
    setLoading(true)
    setResendLoading(true)
    try {
      await mailService.sendVerificationEmail(formData.email)
      toast.success("Mã xác nhận đã được gửi đến email của bạn.")
      setIsVerificationSent(true)
      startCooldown()
    } catch {
      toast.error("Không thể gửi mã xác nhận. Vui lòng thử lại.")
    } finally {
      setResendLoading(false)
      setLoading(false)
    }
  }

  const startCooldown = () => {
    setCooldown(60)
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleCodeChange = (e, idx) => {
    const value = e.target.value.toUpperCase()
    if (/^[A-Z0-9]$/.test(value) || value === "") {
      const newCode = [...verificationCode]
      newCode[idx] = value
      setVerificationCode(newCode)
      if (value && idx < 5) {
        document.getElementById(`code-${idx + 1}`).focus()
      }
    }
    if (e.key === "Backspace" && !value && idx > 0) {
      const newCode = [...verificationCode]
      newCode[idx - 1] = ""
      setVerificationCode(newCode)
      document.getElementById(`code-${idx - 1}`).focus()
    }
  }

  const handleVerifyCode = async () => {
    try {
      const code = verificationCode.join("")
      await mailService.verifyCode(formData.email, code)
      await handleSignup()
    } catch {
      toast.error("Mã xác nhận không hợp lệ. Vui lòng thử lại.")
    }
  }

  const handleSignup = async () => {
    setLoading(true)
    try {
      await authService.signup(formData.username, formData.email, formData.password, formData.secondaryPassword)
      toast.success("Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.")
      setTimeout(() => navigate("/"), 2000)
    } catch {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const isAccountNameTaken = await accountAvailabilityService.checkAccountNameAvailability(formData.username)
    const isEmailTaken = await accountAvailabilityService.checkEmailAvailability(formData.email)
    if (isAccountNameTaken) {
      toast.error("Tên tài khoản đã tồn tại.")
      return
    }
    if (isEmailTaken) {
      toast.error("Email đã tồn tại.")
      return
    }
    await handleSendVerification()
  }

  return (
    <div className="game-auth-container">
      <div className="game-auth-card">
        <div className="game-logo">
          <h1>Blade & Soul</h1>
        </div>

        <div className="game-auth-content">
          <h2 className="game-auth-title">
            {isVerificationSent ? (
              <>
                <span className="text-secondary">Xác nhận</span> mã OTP
              </>
            ) : (
              <>
                <span className="text-secondary">Đăng ký</span> tài khoản
              </>
            )}
          </h2>

          {!isVerificationSent ? (
            <form onSubmit={handleSubmit} className="game-auth-form">
              <div className="form-field">
                <label className="form-label">Tên đăng nhập</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="username"
                    placeholder="Nhập tên đăng nhập (tối thiểu 6 ký tự)"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`game-input ${errors.username ? "error" : ""}`}
                  />
                  <div className="input-border"></div>
                </div>
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>

              <div className="form-field">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`game-input ${errors.email ? "error" : ""}`}
                  />
                  <div className="input-border"></div>
                </div>
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-field">
                <label className="form-label">Mật khẩu cấp 1</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`game-input ${errors.password ? "error" : ""}`}
                  />
                  <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <div className="input-border"></div>
                </div>
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>

              <div className="form-field">
                <label className="form-label">Xác nhận mật khẩu cấp 1</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`game-input ${errors.confirmPassword ? "error" : ""}`}
                  />
                  <button type="button" className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <div className="input-border"></div>
                </div>
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>

              <div className="form-field">
                <label className="form-label">Mật khẩu cấp 2</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="secondaryPassword"
                    placeholder="Nhập mật khẩu cấp 2 (tối thiểu 6 ký tự)"
                    value={formData.secondaryPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`game-input ${errors.secondaryPassword ? "error" : ""}`}
                  />
                  <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <div className="input-border"></div>
                </div>
                {errors.secondaryPassword && <div className="error-message">{errors.secondaryPassword}</div>}
              </div>

              <div className="form-field">
                <label className="form-label">Xác nhận mật khẩu cấp 2</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmSecondaryPassword"
                    placeholder="Nhập lại mật khẩu cấp 2"
                    value={formData.confirmSecondaryPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`game-input ${errors.confirmSecondaryPassword ? "error" : ""}`}
                  />
                  <button type="button" className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <div className="input-border"></div>
                </div>
                {errors.confirmSecondaryPassword && (
                  <div className="error-message">{errors.confirmSecondaryPassword}</div>
                )}
              </div>

              <button type="submit" className="game-button secondary-button" disabled={loading}>
                {loading ? <span className="loading-spinner"></span> : "Đăng ký"}
              </button>
            </form>
          ) : (
            <div className="verification-container">
              <div className="verification-code-inputs">
                {verificationCode.map((code, idx) => (
                  <div className="code-input-wrapper" key={idx}>
                    <input
                      id={`code-${idx}`}
                      type="text"
                      maxLength="1"
                      value={code}
                      onChange={(e) => handleCodeChange(e, idx)}
                      onKeyDown={(e) => handleCodeChange(e, idx)}
                      className="game-input code-input"
                      autoComplete="off"
                    />
                    <div className="input-border"></div>
                  </div>
                ))}
              </div>

              <button onClick={handleVerifyCode} className="game-button accent-button verification-button">
                Xác Nhận
              </button>

              <button
                onClick={cooldown === 0 ? handleSendVerification : null}
                className={`resend-code ${cooldown > 0 ? "disabled" : ""}`}
                disabled={cooldown > 0}
              >
                {resendLoading
                  ? "Đang gửi lại..."
                  : cooldown > 0
                    ? `Gửi lại mã sau ${cooldown}s`
                    : "Gửi lại mã xác nhận"}
              </button>
            </div>
          )}

          {!isVerificationSent && (
            <div className="auth-footer">
              <p>
                Đã có tài khoản?
                <Link to="/dang-nhap" className="login-link">
                  <span className="text-primary"> Đăng nhập ngay</span>
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
