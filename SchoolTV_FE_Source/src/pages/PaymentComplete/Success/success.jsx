import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Home, FileText } from "lucide-react";
import "./success.css";
import { Link } from "react-router-dom";
const PaymentSuccess = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <div className="success-container">
      <motion.div
        className="success-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle size={80} />
        </motion.div>

        <motion.h1
          className="success-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Thanh toán thành công!
        </motion.h1>

        <motion.p
          className="success-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Cảm ơn bạn đã đăng ký khóa học tại SchoolUI_TV. Thông tin chi tiết đã
          được gửi vào email của bạn.
        </motion.p>

        <motion.div
          className="success-details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="detail-row">
            <span>Mã đơn hàng</span>
            <span>#SCH123456</span>
          </div>
          <div className="detail-row">
            <span>Gói đăng ký</span>
            <span>Premium Course</span>
          </div>
          <div className="detail-row">
            <span>Thời gian</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span>Tổng thanh toán</span>
            <span>1,999,000 VNĐ</span>
          </div>
        </motion.div>

        <motion.div
          className="success-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link className="action-button secondary" to="/">
            <Home size={20} />
            Trang chủ
          </Link>
          <button className="action-button primary">
            <FileText size={20} />
            Xem khóa học
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
