import React, { useState } from 'react'; 
import './style.css';

const BankTransfer = () => {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  
  const amountOptions = [
    { value: 10000, label: '10,000đ' },
    { value: 20000, label: '20,000đ' },
    { value: 50000, label: '50,000đ' }
  ];

  const bankInfo = [
    { label: 'Tên ngân hàng', value: 'Vietcombank' },
    { label: 'Số tài khoản', value: '9979566666' },
    { label: 'Chủ tài khoản', value: 'Dao Van Quan' },
    { label: 'Nội dung chuyển tiền', value: 'GWw3p4q3b18c2jjWG' }
  ];
  
  // Hàm tạo QR code URL dựa trên số tiền
  const generateQrCodeUrl = (amount) => {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const qrData = {
      bank: 'Vietcombank',
      account: '9979566666',
      name: 'Dao Van Quan',
      amount: amount,
      content: 'GWw3p4q3b18c2jjWG'
    };
    return `${baseUrl}?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsDropdownOpen(false);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const selectedOption = amountOptions.find(option => option.value === selectedAmount);

  return (
    <div className="bank-transfer-container">
      <div className="transfer-layout">
        {/* Cột bên trái - Thông tin chuyển khoản */}
        <div className="transfer-column left-column">
          <h2>Chuyển khoản thủ công</h2>
          <table className="bank-info-table">
            <tbody>
              {bankInfo.map((item, index) => (
                <tr key={index}>
                  <td className="info-label">{item.label}</td>
                  <td>
                    <div className="copyable-field">
                      <span className="copyable-text">{item.value}</span>
                      <button 
                        className="copy-button" 
                        onClick={() => copyToClipboard(item.value, index)}
                      >
                        <span className="copy-icon">📋</span>
                        {copiedField === index && (
                          <span className="copied-tooltip">Đã sao chép!</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Cột bên phải - QR code */}
        <div className="transfer-column right-column">
          <div className="qr-transfer-section">
            <h2>Chuyển khoản bằng mã QR</h2>
            <div className="amount-selector">
              <div 
                className="amount-dropdown-toggle" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>Số tiền: {selectedOption?.label || ''}</span>
                <span className="dropdown-icon">{isDropdownOpen ? '▲' : '▼'}</span>
              </div>
              {isDropdownOpen && (
                <div className="amount-dropdown">
                  {amountOptions.map(option => (
                    <div
                      key={option.value}
                      className={`dropdown-option ${selectedAmount === option.value ? 'selected' : ''}`}
                      onClick={() => handleAmountSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="qr-code-container">
              <img 
                src={generateQrCodeUrl(selectedAmount)} 
                alt={`QR code for ${selectedAmount} VND`} 
                className="qr-code-image" 
              />
              <p className="amount-display">{selectedOption?.label || ''}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="divider"></div>
      <div className="section-title">
        <h3>Nạp Tiền</h3>
      </div>
      <div className="divider"></div>
      <div className="bank-info-footer">
        <p className="napas-info">napas 247</p>
        <p>Vietcombank</p>
      </div>
    </div>
  );
};

export default BankTransfer;