/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { FaCopy, FaChevronDown, FaYenSign } from "react-icons/fa"
import { MdAccountBalance } from "react-icons/md"
import { GiCrossedSwords, GiDragonHead, GiScrollUnfurled, GiCoins } from "react-icons/gi"
import QRCode from "react-qr-code"
import "./style.css"

const BankTransfer = () => {
  const [selectedAmount, setSelectedAmount] = useState(10000)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copiedField, setCopiedField] = useState(null)
  const qrCodeRef = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateZ = useTransform(x, [-100, 100], [-10, 10])
  const opacity = useTransform(y, [-100, 100], [0.3, 0.9])

  const controls = useAnimation()
  const balanceControls = useAnimation()
  const tableControls = useAnimation()
  const qrControls = useAnimation()

  const amountOptions = [
    { value: 10000, label: "10,000đ", gems: 100 },
    { value: 20000, label: "20,000đ", gems: 220 },
    { value: 50000, label: "50,000đ", gems: 600 },
    { value: 100000, label: "100,000đ", gems: 1300 },
    { value: 200000, label: "200,000đ", gems: 2700 },
    { value: 500000, label: "500,000đ", gems: 7000 },
  ]

  const bankInfo = [
    { label: "Tên ngân hàng", value: "Vietcombank", icon: <MdAccountBalance /> },
    { label: "Số tài khoản", value: "0123456789", icon: <GiScrollUnfurled /> },
    { label: "Chủ tài khoản", value: "BLADE AND SOUL", icon: <GiCrossedSwords /> },
    { label: "Nội dung chuyển tiền", value: "BNS-GWw3p4q3b18c2jjWG", icon: <GiDragonHead /> },
  ]

  // Generate QR code data based on amount
  const generateQrCodeData = (amount) => {
    return JSON.stringify({
      bank: "Vietcombank",
      account: "0123456789",
      name: "BLADE AND SOUL",
      amount: amount,
      content: "BNS-GWw3p4q3b18c2jjWG",
    })
  }

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setIsDropdownOpen(false)

    // Animate QR code change
    qrControls.start({
      scale: [0.8, 1],
      opacity: [0.5, 1],
      transition: { duration: 0.8, type: "spring", stiffness: 200, damping: 15 },
    })
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  // Initialize animations
  useEffect(() => {
    // Start main container animation
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    })

    // Start balance animation
    balanceControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.4, ease: "easeOut" },
    })

    // Start table rows animation
    tableControls.start({
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 },
    })

    // Mouse move effect for particles
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      x.set((clientX - centerX) / 10)
      y.set((clientY - centerY) / 10)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [controls, balanceControls, tableControls, x, y])

  const selectedOption = amountOptions.find((option) => option.value === selectedAmount)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const balanceVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: "easeOut" } },
  }

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const glowVariants = {
    initial: { opacity: 0.3, scale: 0.9 },
    animate: {
      opacity: [0.3, 0.8, 0.3],
      scale: [0.9, 1.05, 0.9],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      },
    },
  }

  const particleVariants = {
    animate: {
      y: [0, -100],
      opacity: [0, 1, 0],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  }

  return (
    <div className="bns-outer">
      <div className="bns-background"></div>

      {/* Particles with Framer Motion */}
      <div className="bns-particles">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="bns-particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, -300],
              opacity: [0, 0.7, 0],
              transition: {
                duration: 5 + Math.random() * 5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              },
            }}
            style={{
              position: "absolute",
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              backgroundColor: "#e6c589",
              borderRadius: "50%",
              boxShadow: "0 0 10px #e6c589",
            }}
          />
        ))}
      </div>

      {/* Glow effect */}
      <motion.div
        className="bns-glow"
        variants={glowVariants}
        initial="initial"
        animate="animate"
        style={{ rotateZ, opacity }}
      />

      <motion.div
        ref={qrCodeRef}
        className="bns-container"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="bns-header">
          <motion.div
            className="bns-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}>
              <GiCrossedSwords className="bns-logo-icon" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
              BLADE & SOUL
            </motion.h1>
          </motion.div>

          <motion.div className="bns-balance" variants={balanceVariants} initial="hidden" animate={balanceControls}>
            <GiCoins className="bns-balance-icon" />
            <span className="bns-balance-label">
              Số dư: <span className="bns-balance-amount">1,250,000đ</span>
            </span>
          </motion.div>
        </div>

        <motion.div
          className="bns-title-bar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2>NẠP TIỀN VÀO TÀI KHOẢN</h2>
          <motion.div
            className="bns-title-decoration"
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          ></motion.div>
        </motion.div>

        <div className="bns-grid">
          {/* Left column - Manual transfer info */}
          <motion.div
            className="bns-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.h2
              className="bns-section-title"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MdAccountBalance className="bns-title-icon" />
              Chuyển khoản ngân hàng
            </motion.h2>

            <div className="bns-table-container">
              <motion.table
                className="bns-table"
                variants={{ hidden: {}, visible: {} }}
                initial="hidden"
                animate={tableControls}
              >
                <tbody>
                  {bankInfo.map((item, index) => (
                    <motion.tr
                      key={index}
                      className="bns-table-row"
                      variants={tableRowVariants}
                      whileHover={{
                        backgroundColor: "rgba(30, 60, 114, 0.3)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <td className="bns-table-label">
                        <motion.span
                          className="bns-label-icon"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {item.icon}
                        </motion.span>
                        {item.label}
                      </td>
                      <td>
                        <div className="bns-copyable-field">
                          <span className="bns-copyable-text">{item.value}</span>
                          <motion.button
                            className="bns-copy-btn"
                            onClick={() => copyToClipboard(item.value, index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaCopy size={16} />
                            <AnimatePresence>
                              {copiedField === index && (
                                <motion.span
                                  className="bns-copied-tooltip"
                                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.5, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  Đã sao chép!
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </motion.table>
            </div>

            <motion.div
              className="bns-note"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <p>Lưu ý: Sau khi chuyển khoản, hệ thống sẽ tự động cập nhật trong vòng 5 phút.</p>
            </motion.div>
          </motion.div>

          {/* Right column - QR code */}
          <motion.div
            className="bns-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.h2
              className="bns-section-title"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaYenSign className="bns-title-icon" />
              Quét mã QR
            </motion.h2>

            <motion.div
              className="bns-amount-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="bns-amount-dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ backgroundColor: "rgba(30, 60, 114, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Số tiền: {selectedOption?.label || ""}</span>
                <AnimatePresence mode="wait">
                  {isDropdownOpen ? (
                    <motion.div
                      key="up"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      exit={{ rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown size={12} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="down"
                      initial={{ rotate: 180 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown size={12} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="bns-amount-dropdown"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {amountOptions.map((option, index) => (
                      <motion.div
                        key={option.value}
                        className={`bns-dropdown-option ${selectedAmount === option.value ? "selected" : ""}`}
                        onClick={() => handleAmountSelect(option.value)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        whileHover={{
                          backgroundColor: "rgba(30, 60, 114, 0.5)",
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{option.label}</span>
                        <span className="bns-gem-amount">
                          +{option.gems} <GiCoins />
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="bns-qr-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.div className="bns-qr-code" animate={qrControls}>
                <QRCode
                  value={generateQrCodeData(selectedAmount)}
                  size={180}
                  level="H"
                  bgColor="rgba(0,0,0,0.7)"
                  fgColor="#e6c589"
                />
                <motion.div
                  className="bns-qr-border"
                  animate={{
                    boxShadow: [
                      "0 0 5px rgba(230, 197, 137, 0.3)",
                      "0 0 20px rgba(230, 197, 137, 0.7)",
                      "0 0 5px rgba(230, 197, 137, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </motion.div>

              <motion.div
                className="bns-amount-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <motion.p
                  className="bns-amount-value"
                  key={selectedAmount}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedOption?.label || ""}
                </motion.p>
                <motion.p
                  className="bns-gem-value"
                  key={`gems-${selectedAmount}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  +{selectedOption?.gems || 0} <GiCoins />
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="bns-divider"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 1, duration: 0.8 }}
        ></motion.div>

        <motion.div
          className="bns-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div className="bns-payment-methods">
            {["Napas", "Vietcombank", "Momo"].map((method, index) => (
              <motion.img
                key={method}
                src={`/placeholder.svg?height=30&width=60`}
                alt={method}
                className="bns-payment-logo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, filter: "grayscale(0)" }}
              />
            ))}
          </div>
          <motion.p
            className="bns-support"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            Hỗ trợ: cyberrealmgames@gmail.com
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default BankTransfer
