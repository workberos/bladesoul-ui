const HoTro = () => {
  const faqs = [
    {
      question: "Làm sao để tải game?",
      answer: "Nhấn vào nút 'Tải game' trên navbar và làm theo hướng dẫn."
    },
    {
      question: "Nạp tiền không thành công?",
      answer: "Vui lòng kiểm tra lại thông tin thẻ hoặc liên hệ hỗ trợ qua email."
    },
    {
      question: "Quên mật khẩu?",
      answer: "Truy cập trang đăng nhập và nhấn 'Quên mật khẩu'."
    }
  ];

  return (
    <div className="page-container">
      <h1>Trung tâm hỗ trợ</h1>
      <div className="contact-info">
        <p>Email: support@neogame.com</p>
        <p>Hotline: 1900 1234</p>
      </div>
      
      <div className="faq-section">
        <h2>Câu hỏi thường gặp</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoTro;