import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import "./register.scss";

function Register() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    phoneNumber: "",
    address: "",
  });
  
  // OTP states 
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpValues, setOTPValues] = useState(["", "", "", "", "", ""]);
  const [otpEmail, setOtpEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }
    
    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    
    // Full name
    if (!formData.fullname) {
      newErrors.fullname = "Vui lòng nhập họ và tên";
    }
    
    // Phone number
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }
    
    // Address
    if (!formData.address) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOTPValues = [...otpValues];
      newOTPValues[index] = value;
      setOTPValues(newOTPValues);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(
          `input[name=otp-${index + 1}]`
        );
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle OTP paste
  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOTPValues = pastedData.split("");
      setOTPValues(newOTPValues);
    }
  };

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    const otpCode = otpValues.join("");
    if (otpCode.length !== 6) {
      notification.error({
        message: "Mã OTP không hợp lệ",
        description: "Vui lòng nhập đầy đủ mã OTP 6 số",
        placement: "topRight",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7057/api/accounts/otp/verify",
        {
          email: otpEmail,
          otpCode: otpCode,
        }
      );

      if (response.status === 200) {
        notification.success({
          message: "Xác thực thành công!",
          description: "Tài khoản của bạn đã được kích hoạt.",
          placement: "topRight",
        });
        navigate("/login");
      }
    } catch (error) {
      notification.error({
        message: "Xác thực thất bại",
        description: "Mã OTP không chính xác hoặc đã hết hạn",
        placement: "topRight",
      });
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7057/api/accounts/otp/resend",
        {
          email: otpEmail,
        }
      );

      if (response.status === 200) {
        notification.success({
          message: "Gửi lại mã OTP thành công",
          description: response.data.message,
          placement: "topRight",
        });
        startResendTimer();
      }
    } catch (error) {
      notification.error({
        message: "Gửi lại mã OTP thất bại",
        description: error.response?.data?.message || "Đã có lỗi xảy ra",
        placement: "topRight",
      });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!agreeTerms) {
      notification.error({
        message: "Chưa đồng ý điều khoản",
        description: "Bạn cần đồng ý với điều khoản trước khi đăng ký tài khoản.",
        placement: "topRight",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(
        "https://localhost:7057/api/accounts/otp/register",
        formData
      );

      if (response.status === 200) {
        notification.success({
          message: "Đăng ký thành công!",
          description: "Vui lòng kiểm tra email của bạn (bao gồm thư mục spam) để lấy mã OTP xác thực tài khoản.",
          placement: "topRight",
          duration: 0,
        });
        setOtpEmail(formData.email);
        setShowOTPVerification(true);
        startResendTimer();
      }
    } catch (error) {
      let errorMessage = "Có lỗi xảy ra, vui lòng thử lại sau.";

      if (error.response?.status === 409) {
        errorMessage = "Username hoặc Email đã tồn tại, vui lòng thử lại!";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      notification.error({
        message: "Đăng ký thất bại!",
        description: errorMessage,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render OTP verification UI
  if (showOTPVerification) {
    return (
      <div className="auth-register-container" data-theme={theme}>
        <div className="auth-register-card auth-otp-card">
          <h1>Xác thực tài khoản</h1>
          <p>
            Chúng tôi đã gửi mã OTP đến email {otpEmail}.<br />
            Vui lòng kiểm tra cả hộp thư spam nếu bạn không nhận được email.
          </p>
          
          <div className="auth-otp-inputs">
            {otpValues.map((value, index) => (
              <input
                key={index}
                type="text"
                name={`otp-${index}`}
                value={value}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onPaste={handleOTPPaste}
                maxLength={1}
                className="auth-otp-input"
              />
            ))}
          </div>

          <button 
            className="auth-register-submit"
            onClick={handleVerifyOTP}
          >
            Xác thực
          </button>

          <div className="auth-otp-resend">
            {resendTimer > 0 ? (
              <p>Gửi lại mã sau {resendTimer} giây</p>
            ) : (
              <button 
                className="auth-otp-resend-button"
                onClick={handleResendOTP}
              >
                Gửi lại mã OTP
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main registration form UI
  return (
    <div className="auth-register-container" data-theme={theme}>
      <div className="auth-register-card">
        <h1>Hãy bắt đầu với Một tài khoản mới</h1>
        <p>Tham gia SchoolTV ngay hôm nay để bắt đầu một hành trình tại đại học của bạn một cách hoàn hảo nhất!</p>
        
        <div className="auth-register-school-banner">
          <svg className="auth-register-school-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <Link to="/school-register" className="auth-register-school-link">
            Bạn muốn đăng ký tài khoản với tư cách là trường học?
          </Link>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="auth-register-columns">
            <div className="auth-register-column">
              <div className="auth-register-field">
                <label className="auth-register-label">Tên đăng nhập</label>
                <div className="auth-register-input-wrapper">
                  <svg className="auth-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input 
                    type="text" 
                    name="username"
                    className="auth-register-input" 
                    placeholder="Chọn tên đăng nhập" 
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                {errors.username && <div className="auth-register-error">{errors.username}</div>}
              </div>
              
              <div className="auth-register-field">
                <label className="auth-register-label">Email</label>
                <div className="auth-register-input-wrapper">
                  <svg className="auth-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input 
                    type="email" 
                    name="email"
                    className="auth-register-input" 
                    placeholder="Nhập email của bạn" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <div className="auth-register-error">{errors.email}</div>}
              </div>
              
              <div className="auth-register-field">
                <label className="auth-register-label">Mật khẩu</label>
                <div className="auth-register-input-wrapper">
                  <svg className="auth-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    className="auth-register-input auth-register-password" 
                    placeholder="Tạo mật khẩu" 
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <svg 
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-register-eye-icon" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    {showPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </>
                    )}
                  </svg>
                </div>
                {errors.password && <div className="auth-register-error">{errors.password}</div>}
              </div>
            </div>
            
            <div className="auth-register-column">
              <div className="auth-register-field">
                <label className="auth-register-label">Họ và tên</label>
                <div className="auth-register-input-wrapper">
                  <svg className="auth-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <input 
                    type="text" 
                    name="fullname"
                    className="auth-register-input" 
                    placeholder="Nhập họ và tên của bạn" 
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                </div>
                {errors.fullname && <div className="auth-register-error">{errors.fullname}</div>}
              </div>
              
              <div className="auth-register-field">
                <label className="auth-register-label">Số điện thoại</label>
                <div className="auth-register-input-wrapper">
                  <svg className="auth-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    className="auth-register-input" 
                    placeholder="Nhập số điện thoại của bạn" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                {errors.phoneNumber && <div className="auth-register-error">{errors.phoneNumber}</div>}
              </div>
              
              <div className="auth-register-field">
                <label className="auth-register-label">Xác nhận mật khẩu</label>
                <div className="auth-register-input-wrapper">
                  <svg className="auth-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword"
                    className="auth-register-input auth-register-password" 
                    placeholder="Nhập lại mật khẩu" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <svg 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="auth-register-eye-icon" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    {showConfirmPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </>
                    )}
                  </svg>
                </div>
                {errors.confirmPassword && <div className="auth-register-error">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>
          
          <div className="auth-register-field">
            <label className="auth-register-label">Địa chỉ</label>
            <div className="auth-register-input-wrapper">
              <svg className="auth-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <input 
                type="text" 
                name="address"
                className="auth-register-input" 
                placeholder="Nhập địa chỉ của bạn" 
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            {errors.address && <div className="auth-register-error">{errors.address}</div>}
          </div>
          
          <div className="auth-register-terms">
            <label className="auth-register-terms-checkbox">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                Tôi đồng ý với <span className="auth-register-terms-link" onClick={() => setIsModalVisible(true)}>Điều khoản và Điều kiện</span>
              </span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="auth-register-submit"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Tạo Tài Khoản"}
          </button>
          
          <div className="auth-register-login">
            <span>Bạn đã có tài khoản?</span>
            <Link to="/login" className="auth-register-login-link">Đăng nhập</Link>
          </div>
        </form>
      </div>
      
      {isModalVisible && (
        <div className="auth-register-modal">
          <div className="auth-register-modal-content">
            <div className="auth-register-modal-header">
              <h3>Điều khoản và Điều kiện</h3>
              <button 
                className="auth-register-modal-close"
                onClick={() => setIsModalVisible(false)}
              >
                ×
              </button>
            </div>
            <div className="auth-register-modal-body">
              <p>
                <strong>
                  Chào mừng bạn đến với ứng dụng SchoolTV! Trước khi sử dụng dịch vụ
                  của chúng tôi, vui lòng đọc kỹ các điều khoản và điều kiện sau
                  đây. Khi bạn đăng ký tài khoản hoặc sử dụng dịch vụ, bạn vui lòng
                  đồng ý tuân thủ các điều khoản này.
                </strong>
              </p>
              {/* Terms and conditions content */}
              {/* ... (rest of the terms content remains the same) ... */}
            </div>
            <div className="auth-register-modal-footer">
              <button 
                className="auth-register-modal-button"
                onClick={() => setIsModalVisible(false)}
              >
                Tôi đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;