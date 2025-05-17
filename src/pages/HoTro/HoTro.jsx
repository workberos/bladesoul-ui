/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaUserPlus,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaCheckCircle,
  FaInfoCircle,
  FaPlay,
  FaGamepad,
  FaTrophy,
  FaDiscord,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa"
import { MdAccountBalanceWallet, MdHelp } from "react-icons/md"
import { GiCrownedSkull, GiSwordWound, GiFireShield } from "react-icons/gi"
import "./style.css"

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("account")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef(null);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  useEffect(() => {
    // Particle effect for background
    const createParticle = () => {
      const particles = document.querySelector(".particles")
      if (!particles) return

      const particle = document.createElement("div")
      particle.classList.add("particle")

      // Random position
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight

      // Random size
      const size = Math.random() * 5 + 2

      // Random color
      const colors = ["#ff073a", "#0ff0fc", "#7a04eb", "#ff0", "#0f0"]
      const color = colors[Math.floor(Math.random() * colors.length)]

      // Set styles
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.background = color

      // Add to DOM
      particles.appendChild(particle)

      // Remove after animation
      setTimeout(() => {
        particle.remove()
      }, 5000)
    }

    // Create particles at intervals
    const particleInterval = setInterval(createParticle, 200)

    return () => {
      clearInterval(particleInterval)
    }
  }, [])

  return (
    <div className="game-guide-container">
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/game-background.mp4" type="video/mp4" />
        </video>
        <div className="overlay"></div>
      </div>

      <div className="particles"></div>

      <header className="game-header">
        <motion.div
          className="logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GiCrownedSkull className="logo-icon" />
          <h1 className="neon-text">BLADE & SOUL</h1>
        </motion.div>
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <ul>
            <li>
              <button className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>
                <FaUserPlus /> TẠO TÀI KHOẢN
              </button>
            </li>
            <li>
              <button className={activeTab === "deposit" ? "active" : ""} onClick={() => setActiveTab("deposit")}>
                <FaMoneyBillWave /> NẠP TIỀN
              </button>
            </li>
            <li>
              <button className={activeTab === "faq" ? "active" : ""} onClick={() => setActiveTab("faq")}>
                <FaQuestionCircle /> FAQ
              </button>
            </li>
          </ul>
        </motion.nav>
      </header>

      <main>
        <motion.section
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-content">
            <h2 className="glitch-text" data-text="BẮT ĐẦU HÀNH TRÌNH">
              BẮT ĐẦU HÀNH TRÌNH
            </h2>
            <p>Tham gia thế giới game đỉnh cao ngay hôm nay</p>

            <div className="hero-buttons">
              <button className="cta-button primary">
                <FaGamepad /> CHƠI NGAY
              </button>
              <button className="cta-button secondary" onClick={playVideo}>
                <FaPlay /> XEM TRAILER
              </button>
            </div>
          </div>

          <div className={`video-modal ${isVideoPlaying ? "active" : ""}`}>
            <div className="video-container">
              <button className="close-video" onClick={() => setIsVideoPlaying(false)}>
                ×
              </button>
              <video ref={videoRef} controls>
                <source src="/game-trailer.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </motion.section>

        <AnimatePresence mode="wait">
          {activeTab === "account" && (
            <motion.section
              className="guide-section"
              key="account"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">
                <FaUserPlus /> HƯỚNG DẪN TẠO TÀI KHOẢN
              </h2>

              <div className="steps-container">
                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>TRUY CẬP TRANG ĐĂNG KÝ</h3>
                    <p>Nhấn vào nút "ĐĂNG KÝ" ở góc phải trên cùng của trang chủ.</p>
                    <div className="step-image">
                      <img src="/placeholder.svg?height=200&width=400" alt="Trang đăng ký" />
                      <div className="image-overlay">
                        <FaPlay className="play-icon" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>ĐIỀN THÔNG TIN CÁ NHÂN</h3>
                    <p>Nhập đầy đủ thông tin cá nhân của bạn vào biểu mẫu đăng ký.</p>
                    <ul className="info-list">
                      <li>
                        <FaCheckCircle /> Tên nhân vật
                      </li>
                      <li>
                        <FaCheckCircle /> Email
                      </li>
                      <li>
                        <FaCheckCircle /> Mật khẩu mạnh
                      </li>
                      <li>
                        <FaCheckCircle /> Xác nhận mật khẩu
                      </li>
                    </ul>
                    <div className="step-image">
                      <img src="/placeholder.svg?height=200&width=400" alt="Form đăng ký" />
                      <div className="image-overlay">
                        <FaPlay className="play-icon" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>XÁC MINH TÀI KHOẢN</h3>
                    <p>Kiểm tra email của bạn và nhấp vào liên kết xác minh được gửi đến.</p>
                    <div className="note">
                      <FaInfoCircle /> Lưu ý: Liên kết xác minh có hiệu lực trong 24 giờ.
                    </div>
                    <div className="step-image">
                      <img src="/placeholder.svg?height=200&width=400" alt="Email xác minh" />
                      <div className="image-overlay">
                        <FaPlay className="play-icon" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>HOÀN TẤT ĐĂNG KÝ</h3>
                    <p>Sau khi xác minh, đăng nhập và cập nhật thông tin cá nhân của bạn.</p>
                    <div className="success-message">
                      <FaCheckCircle /> CHÚC MỪNG! BẠN ĐÃ SẴN SÀNG CHINH PHỤC THẾ GIỚI GAME!
                    </div>
                    <div className="rewards-box">
                      <h4>
                        <FaTrophy /> PHẦN THƯỞNG NGƯỜI MỚI
                      </h4>
                      <ul>
                        <li>
                          <GiSwordWound /> Vũ khí huyền thoại x1
                        </li>
                        <li>
                          <GiFireShield /> Giáp hiếm x1
                        </li>
                        <li>
                          <FaMoneyBillWave /> 1000 Kim Cương
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {activeTab === "deposit" && (
            <motion.section
              className="guide-section"
              key="deposit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">
                <FaMoneyBillWave /> HƯỚNG DẪN NẠP TIỀN
              </h2>

              <div className="steps-container">
                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>ĐĂNG NHẬP VÀO TÀI KHOẢN</h3>
                    <p>Đăng nhập vào tài khoản game của bạn.</p>
                    <div className="step-image">
                      <img src="/placeholder.svg?height=200&width=400" alt="Đăng nhập" />
                      <div className="image-overlay">
                        <FaPlay className="play-icon" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>TRUY CẬP KHO BÁU</h3>
                    <p>Nhấp vào biểu tượng "KHO BÁU" hoặc "NẠP TIỀN" trong menu game.</p>
                    <div className="step-image">
                      <img src="/placeholder.svg?height=200&width=400" alt="Menu nạp tiền" />
                      <div className="image-overlay">
                        <FaPlay className="play-icon" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>CHỌN GÓI KIM CƯƠNG</h3>
                    <p>Chọn gói Kim Cương phù hợp với nhu cầu của bạn:</p>
                    <div className="packages-grid">
                      <div className="package">
                        <div className="package-name">CƠ BẢN</div>
                        <div className="package-price">100K VNĐ</div>
                        <div className="package-content">100 Kim Cương</div>
                        <div className="package-bonus">+10 Kim Cương Bonus</div>
                      </div>
                      <div className="package popular">
                        <div className="popular-tag">PHỔ BIẾN</div>
                        <div className="package-name">CHIẾN BINH</div>
                        <div className="package-price">500K VNĐ</div>
                        <div className="package-content">550 Kim Cương</div>
                        <div className="package-bonus">+100 Kim Cương Bonus</div>
                      </div>
                      <div className="package">
                        <div className="package-name">HUYỀN THOẠI</div>
                        <div className="package-price">1000K VNĐ</div>
                        <div className="package-content">1200 Kim Cương</div>
                        <div className="package-bonus">+300 Kim Cương Bonus</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>CHỌN PHƯƠNG THỨC THANH TOÁN</h3>
                    <p>Chọn một trong các phương thức thanh toán có sẵn:</p>
                    <div className="payment-methods">
                      <div className="payment-method">
                        <MdAccountBalanceWallet size={24} />
                        <span>VÍ ĐIỆN TỬ</span>
                      </div>
                      <div className="payment-method">
                        <FaMoneyBillWave size={24} />
                        <span>NGÂN HÀNG</span>
                      </div>
                      <div className="payment-method">
                        <FaMoneyBillWave size={24} />
                        <span>THẺ TÍN DỤNG</span>
                      </div>
                    </div>
                    <div className="step-image">
                      <img src="/placeholder.svg?height=200&width=400" alt="Phương thức thanh toán" />
                      <div className="image-overlay">
                        <FaPlay className="play-icon" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>HOÀN TẤT GIAO DỊCH</h3>
                    <p>Làm theo hướng dẫn để hoàn tất giao dịch thanh toán.</p>
                    <div className="success-message">
                      <FaCheckCircle /> Kim Cương sẽ được cộng vào tài khoản của bạn ngay lập tức!
                    </div>
                    <div className="promo-box">
                      <h4>ƯU ĐÃI ĐẶC BIỆT</h4>
                      <p>Nạp lần đầu nhận thêm 50% Kim Cương!</p>
                      <div className="countdown">
                        <span>KẾT THÚC SAU:</span>
                        <div className="timer">48:00:00</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {activeTab === "faq" && (
            <motion.section
              className="guide-section faq-section"
              key="faq"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">
                <FaQuestionCircle /> CÂU HỎI THƯỜNG GẶP
              </h2>

              <div className="faq-container">
                <motion.div
                  className="faq-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <h3>
                    <MdHelp /> Tôi không nhận được email xác minh?
                  </h3>
                  <p>
                    Vui lòng kiểm tra thư mục spam hoặc rác trong hộp thư của bạn. Nếu vẫn không tìm thấy, bạn có thể
                    yêu cầu gửi lại email xác minh trong trang đăng nhập.
                  </p>
                </motion.div>

                <motion.div
                  className="faq-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h3>
                    <MdHelp /> Tôi quên mật khẩu đăng nhập?
                  </h3>
                  <p>
                    Nhấp vào liên kết "Quên mật khẩu" trên trang đăng nhập và làm theo hướng dẫn để đặt lại mật khẩu của
                    bạn.
                  </p>
                </motion.div>

                <motion.div
                  className="faq-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3>
                    <MdHelp /> Tôi đã nạp tiền nhưng chưa nhận được Kim Cương?
                  </h3>
                  <p>
                    Thông thường, Kim Cương sẽ được cập nhật ngay lập tức. Nếu sau 5 phút vẫn chưa nhận được, vui lòng
                    liên hệ với bộ phận hỗ trợ game thủ qua Discord hoặc Fanpage.
                  </p>
                </motion.div>

                <motion.div
                  className="faq-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h3>
                    <MdHelp /> Có giới hạn số tiền nạp không?
                  </h3>
                  <p>
                    Số tiền nạp tối thiểu là 50.000 VNĐ. Không có giới hạn tối đa, bạn có thể nạp tùy thích để trở thành
                    VIP của game!
                  </p>
                </motion.div>

                <motion.div
                  className="faq-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <h3>
                    <MdHelp /> Làm thế nào để trở thành VIP?
                  </h3>
                  <p>
                    Để trở thành VIP, bạn cần nạp tổng cộng 5.000.000 VNĐ. Người chơi VIP sẽ nhận được nhiều đặc quyền
                    như: vũ khí độc quyền, trang phục giới hạn, và hỗ trợ ưu tiên.
                  </p>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <motion.section
          className="gameplay-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="section-title">GAMEPLAY MỚI NHẤT</h2>

          <div className="video-grid">
            <div className="video-item">
              <div className="video-thumbnail">
                <img src="/placeholder.svg?height=180&width=320" alt="Gameplay 1" />
                <div className="play-button">
                  <FaPlay />
                </div>
              </div>
              <h3>BOSS MỚI: RỒNG BĂNG GIÁC</h3>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <img src="/placeholder.svg?height=180&width=320" alt="Gameplay 2" />
                <div className="play-button">
                  <FaPlay />
                </div>
              </div>
              <h3>BẢN ĐỒ MỚI: THUNG LŨNG CHẾT</h3>
            </div>

            <div className="video-item">
              <div className="video-thumbnail">
                <img src="/placeholder.svg?height=180&width=320" alt="Gameplay 3" />
                <div className="play-button">
                  <FaPlay />
                </div>
              </div>
              <h3>VŨ KHÍ MỚI: KIẾM HỎA LONG</h3>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="contact-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="section-title">THAM GIA CỘNG ĐỒNG</h2>
          <p>Kết nối với hàng triệu game thủ khác và nhận thông tin cập nhật mới nhất</p>
          <div className="social-links">
            <a href="https://discord.gg/NFPN8rMKDN" target="_blank" className="social-link discord">
              <FaDiscord size={24} />
              <span>DISCORD</span>
            </a>
            {/* <a href="#" target="_blank" className="social-link youtube">
              <FaYoutube size={24} />
              <span>YOUTUBE</span>
            </a> */}
            <a href="https://www.facebook.com/caffe911/reels" target="_blank" className="social-link facebook">
              <FaFacebook size={24} />
              <span>FACEBOOK</span>
            </a>
          </div>
        </motion.section>
      </main>

      <footer className="game-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <GiCrownedSkull className="logo-icon" />
            <h2 className="neon-text">BLADE & SOUL</h2>
          </div>
          <p>© 2025 Blade & Soul. Email hỗ trợ: cyberrealmgames@gmail.com.</p>
          <div className="footer-links">
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Hỗ trợ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
