const NapTien = () => {
  return (
    <div className="page-container">
      <h1>Nạp tiền vào tài khoản</h1>
      <div className="payment-methods">
        <div className="method">
          <h3>Thẻ cào</h3>
          <input type="text" placeholder="Nhập mã thẻ" />
          <button>Xác nhận</button>
        </div>
        <div className="method">
          <h3>Chuyển khoản ngân hàng</h3>
          <p>Số tài khoản: 123456789</p>
          <p>Ngân hàng: NEO Bank</p>
        </div>
        <div className="method">
          <h3>Ví điện tử</h3>
          <select>
            <option>Momo</option>
            <option>ZaloPay</option>
            <option>ViettelPay</option>
          </select>
          <button>Kết nối</button>
        </div>
      </div>
    </div>
  );
};

export default NapTien;