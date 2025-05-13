import React, { useState, useEffect, useRef } from 'react';
import { FaCopy, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdAccountBalance } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { animate } from 'animejs';
import './style.css';

const BankTransfer = () => {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const containerRef = useRef(null);
  const balanceRef = useRef(null);
  const qrCodeRef = useRef(null);

  const amountOptions = [
    { value: 10000, label: '10,000đ' },
    { value: 20000, label: '20,000đ' },
    { value: 50000, label: '50,000đ' }
  ];

  const bankInfo = [
    { label: 'Tên ngân hàng', value: 'Vietcombank' },
    { label: 'Số tài khoản', value: '666' },
    { label: 'Chủ tài khoản', value: 'Nguyen Van Binh' },
    { label: 'Nội dung chuyển tiền', value: 'GWw3p4q3b18c2jjWG' }
  ];

  // Generate QR code data based on amount
  const generateQrCodeData = (amount) => {
    return JSON.stringify({
      bank: 'Vietcombank',
      account: '666',
      name: 'Nguyen Van Binh',
      amount: amount,
      content: 'GWw3p4q3b18c2jjWG'
    });
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsDropdownOpen(false);
    // Animate QR code change
    if (qrCodeRef.current) {
      animate(qrCodeRef.current, {
        scale: [0.8, 1],
        opacity: [0.5, 1],
        duration: 500,
        easing: 'easeOutElastic(1, .8)'
      });
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Initialize animations
  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutCubic'
      });
    }
    if (balanceRef.current) {
      animate(balanceRef.current, {
        translateY: [-10, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: 300,
        easing: 'easeOutCubic'
      });
    }
  }, []);

  const selectedOption = amountOptions.find(option => option.value === selectedAmount);

  return (
    <div className="banktransfer-outer">
      <div ref={containerRef} className="banktransfer-container">
        <div ref={balanceRef} className="banktransfer-balance">
          <span className="banktransfer-balance-label">
            Số dư: <span className="banktransfer-balance-amount">1,250,000đ</span>
          </span>
        </div>
        <div className="banktransfer-grid">
          {/* Left column - Manual transfer info */}
          <div className="banktransfer-left">
            <h2 className="banktransfer-title">
              <MdAccountBalance className="banktransfer-title-icon" />
              Chuyển khoản thủ công
            </h2>
            <table className="banktransfer-table">
              <tbody>
                {bankInfo.map((item, index) => (
                  <tr key={index} className="banktransfer-table-row">
                    <td className="banktransfer-table-label">{item.label}</td>
                    <td>
                      <div className="banktransfer-copyable-field">
                        <span className="banktransfer-copyable-text">{item.value}</span>
                        <button 
                          className="banktransfer-copy-btn"
                          onClick={() => copyToClipboard(item.value, index)}
                        >
                          <FaCopy size={16} />
                          {copiedField === index && (
                            <span className="banktransfer-copied-tooltip">Đã sao chép!</span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Right column - QR code */}
          <div className="banktransfer-right">
            <h2 className="banktransfer-title">Chuyển khoản bằng mã QR</h2>
            <div className="banktransfer-amount-selector">
              <div 
                className="banktransfer-amount-dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>Số tiền: {selectedOption?.label || ''}</span>
                {isDropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </div>
              {isDropdownOpen && (
                <div className="banktransfer-amount-dropdown">
                  {amountOptions.map(option => (
                    <div
                      key={option.value}
                      className={`banktransfer-dropdown-option ${selectedAmount === option.value ? 'selected' : ''}`}
                      onClick={() => handleAmountSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="banktransfer-qr-container">
              <div ref={qrCodeRef} className="banktransfer-qr-code">
                <QRCode 
                  value={generateQrCodeData(selectedAmount)}
                  size={200}
                  level="H"
                />
              </div>
              <p className="banktransfer-amount-display">{selectedOption?.label || ''}</p>
            </div>
          </div>
        </div>
        <div className="banktransfer-divider"></div>
        <div className="banktransfer-section-title">
          <h3>Nạp Tiền</h3>
        </div>
        <div className="banktransfer-divider"></div>
        <div className="banktransfer-footer">
          <p className="banktransfer-napas">napas 247</p>
          <p>Vietcombank</p>
        </div>
      </div>
    </div>
  );
};

export default BankTransfer;