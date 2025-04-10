import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../config/baseAPI";
import "./payment.css";
import apiFetch from "../../config/baseAPI";
import { message } from "antd";

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const packageData = localStorage.getItem("selectedPackage");
    if (packageData) {
      setSelectedPackage(JSON.parse(packageData));
    } else {
      navigate("/package");
    }
  }, [navigate]);

  const paymentMethods = [
    {
      id: 0,
      name: "Thẻ Visa/Mastercard",
      description: "Thanh toán an toàn qua cổng VNPAY",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png",
    },
    {
      id: 1,
      name: "Ví MoMo",
      description: "Quét mã QR để thanh toán",
      image:
        "https://homepage.momocdn.net/fileuploads/svg/momo-file-240411162904.svg",
    },
    {
      id: 2,
      name: "Chuyển khoản ngân hàng",
      description: "Hỗ trợ +40 ngân hàng tại Việt Nam",
      image:
        "https://theme.hstatic.net/200000467803/1000988268/14/cart_pay_2.png?v=815",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createOrder = async () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const orderData = {
        PackageID: selectedPackage?.packageID,
        Quantity: 1,
        // CustomerInfo: formData,
      };

      const returnUrl = `http://localhost:5173/checkout/success`;
      const cancelUrl = `http://localhost:5173/checkout/cancel`;

      const response = await apiFetch(
        `/api/orders/create?returnUrl=${returnUrl}&cancelUrl=${cancelUrl}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();
      if (result) {
        localStorage.setItem("orderId", JSON.stringify(result));
      }
      console.log("Order result:", result);
      if (result) {
        setOrderId(result.orderId);
        setPaymentLink(result.paymentLink);
        if (result?.paymentLink) {
          window.location.href = result.paymentLink;
        } else {
          message.error(`Lỗi khi tạo đơn hàng: ${result.message}`);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      message.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }
    createOrder();
  };

  if (!selectedPackage) {
    return (
      <div className="payment-loading-container">
        <div className="payment-loading-spinner"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="payment-checkout-container"
    >
      <motion.div
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="payment-checkout-form"
      >
        <h2 className="payment-section-title">Thông tin thanh toán</h2>

        <div className="payment-form-group">
          <label className="payment-form-label">Họ và tên</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="fullName"
            className="payment-form-input"
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </div>

        <div className="payment-form-group">
          <label className="payment-form-label">Email</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            name="email"
            className="payment-form-input"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="payment-form-group">
          <label className="payment-form-label">Số điện thoại</label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="tel"
            name="phone"
            className="payment-form-input"
            placeholder="0xxxxxxxxx"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <h2 className="payment-section-title">Phương thức thanh toán</h2>
        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`payment-method ${
                selectedPayment === method.id ? "selected" : ""
              }`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <img src={method.image} alt={method.name} />
              <div>
                <div className="payment-method-name">{method.name}</div>
                <div className="payment-method-description">
                  {method.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 20 }}
        animate={{ x: 0 }}
        className="payment-order-summary"
      >
        <h2 className="payment-section-title">Tóm tắt đơn hàng</h2>

        <div className="payment-order-item">
          <div>
            <div className="package-name">{selectedPackage.name}</div>
            <div className="package-duration">
              Thời hạn: {selectedPackage.duration} tháng
            </div>
          </div>
          <div className="package-price">
            {selectedPackage.price.toLocaleString()}₫
          </div>
        </div>

        <div className="payment-order-item">
          <div className="discount-label">Giảm giá</div>
          <div className="discount-amount">
            -{selectedPackage.discount || 0}₫
          </div>
        </div>

        <div className="payment-order-total">
          <div>Tổng cộng</div>
          <div>{selectedPackage.finalPrice}₫</div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`payment-checkout-button ${loading ? "loading" : ""}`}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <span>Đang xử lý...</span>
            </>
          ) : (
            "Thanh toán ngay"
          )}
        </motion.button>

        <div className="payment-secure-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 5H3V13H13V5Z" stroke="currentColor" strokeWidth="2" />
            <path
              d="M5 5V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Thanh toán an toàn & bảo mật
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Checkout;
