// SchoolRegister.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import "./schoolRegister.scss";

function SchoolRegister() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    phoneNumber: "",
    address: "",
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
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
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    
    // Full name
    if (!formData.fullname) {
      newErrors.fullname = "Vui lòng nhập tên trường học";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!agreeTerms) {
      notification.error({
        message: "Chưa đồng ý điều khoản",
        description:
          "Bạn cần đồng ý với điều khoản trước khi đăng ký tài khoản.",
        placement: "topRight",
        duration: 5,
      });
      return;
    }
    
    setLoading(true);
    
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phoneNumber: formData.phoneNumber || null,
      fullName: formData.fullname,
      address: formData.address || null,
    };
    
    try {
      const response = await axios.post(
        "https://localhost:44316/api/accounts/schoolowner/signup",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        notification.success({
          message: "Đăng ký tài khoản trường học thành công!",
          description: "Yêu cầu đăng ký đã được gửi. Vui lòng chờ quản trị viên phê duyệt.",
          placement: "topRight",
          duration: 8,
        });

        setTimeout(() => {
          navigate("/school-login");
        }, 3000);
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      if (error.response) {
        let errorMessage = "Có lỗi xảy ra, vui lòng thử lại sau.";

        if (error.response.status === 409) {
          errorMessage = "❌ Username hoặc Email đã tồn tại, vui lòng thử lại!";
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        notification.error({
          message: "Đăng ký thất bại!",
          description: errorMessage,
          placement: "topRight",
          duration: 5,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="school-register-container" data-theme={theme}>
      <div className="school-register-card">
        <div className="school-register-header">
          <svg className="school-register-logo" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h1>Đăng ký tài khoản Trường học</h1>
        </div>
        
        <p className="school-register-description">
          Tạo tài khoản đơn vị trường học để cung cấp dịch vụ nội dung giáo dục và tương tác với sinh viên trên nền tảng SchoolTV
        </p>
        
        <div className="school-register-info-box">
          <svg className="school-register-info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p>
            Sau khi đăng ký, tài khoản của bạn sẽ được gửi đến quản trị viên để xem xét và phê duyệt. Bạn sẽ nhận được thông báo qua email khi tài khoản được kích hoạt.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="school-register-form">
          <div className="school-register-columns">
            <div className="school-register-column">
              <div className="school-register-field">
                <label className="school-register-label">Tên đăng nhập <span className="required">*</span></label>
                <div className="school-register-input-wrapper">
                  <svg className="school-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input 
                    type="text" 
                    name="username"
                    className="school-register-input" 
                    placeholder="Tên đăng nhập của trường" 
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                {errors.username && <div className="school-register-error">{errors.username}</div>}
              </div>
              
              <div className="school-register-field">
                <label className="school-register-label">Email <span className="required">*</span></label>
                <div className="school-register-input-wrapper">
                  <svg className="school-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input 
                    type="email" 
                    name="email"
                    className="school-register-input" 
                    placeholder="Email liên hệ chính thức" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <div className="school-register-error">{errors.email}</div>}
              </div>
              
              <div className="school-register-field">
                <label className="school-register-label">Mật khẩu <span className="required">*</span></label>
                <div className="school-register-input-wrapper">
                  <svg className="school-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    className="school-register-input school-register-password" 
                    placeholder="Tạo mật khẩu (ít nhất 6 ký tự)" 
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <svg 
                    onClick={() => setShowPassword(!showPassword)}
                    className="school-register-eye-icon" 
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
                {errors.password && <div className="school-register-error">{errors.password}</div>}
              </div>
            </div>
            
            <div className="school-register-column">
              <div className="school-register-field">
                <label className="school-register-label">Tên trường học <span className="required">*</span></label>
                <div className="school-register-input-wrapper">
                  <svg className="school-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <input 
                    type="text" 
                    name="fullname"
                    className="school-register-input" 
                    placeholder="Tên đầy đủ của trường học" 
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                </div>
                {errors.fullname && <div className="school-register-error">{errors.fullname}</div>}
              </div>
              
              <div className="school-register-field">
                <label className="school-register-label">Số điện thoại</label>
                <div className="school-register-input-wrapper">
                  <svg className="school-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    className="school-register-input" 
                    placeholder="Số điện thoại liên hệ" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                {errors.phoneNumber && <div className="school-register-error">{errors.phoneNumber}</div>}
              </div>
              
              <div className="school-register-field">
                <label className="school-register-label">Xác nhận mật khẩu <span className="required">*</span></label>
                <div className="school-register-input-wrapper">
                  <svg className="school-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword"
                    className="school-register-input school-register-password" 
                    placeholder="Nhập lại mật khẩu" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <svg 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="school-register-eye-icon" 
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
                {errors.confirmPassword && <div className="school-register-error">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>
          
          <div className="school-register-field">
            <label className="school-register-label">Địa chỉ</label>
            <div className="school-register-input-wrapper">
              <svg className="school-register-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <input 
                type="text" 
                name="address"
                className="school-register-input" 
                placeholder="Địa chỉ của trường học" 
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            {errors.address && <div className="school-register-error">{errors.address}</div>}
          </div>
          
          <div className="school-register-terms">
            <label className="school-register-terms-checkbox">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                Tôi đồng ý với <span className="school-register-terms-link" onClick={() => setIsModalVisible(true)}>Điều khoản và Điều kiện dành cho Trường học</span>
              </span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="school-register-submit"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản trường học"}
          </button>
          
          <div className="school-register-footer">
            <div className="school-register-login">
              <span>Đã có tài khoản trường học?</span>
              <Link to="/school-login" className="school-register-login-link">Đăng nhập</Link>
            </div>
            
            <div className="school-register-back">
              <Link to="/register" className="school-register-back-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Quay lại đăng ký thông thường
              </Link>
            </div>
          </div>
        </form>
      </div>
      
      {isModalVisible && (
        <div className="school-register-modal">
          <div className="school-register-modal-content">
            <div className="school-register-modal-header">
              <h3>Điều khoản và Điều kiện dành cho Trường học</h3>
              <button 
                className="school-register-modal-close"
                onClick={() => setIsModalVisible(false)}
              >
                ×
              </button>
            </div>
            <div className="school-register-modal-body">
              <p>
                <strong>
                  Chào mừng đơn vị trường học đến với ứng dụng SchoolTV! Trước khi sử dụng dịch vụ
                  của chúng tôi, vui lòng đọc kỹ các điều khoản và điều kiện sau
                  đây. Khi bạn đăng ký tài khoản hoặc sử dụng dịch vụ, bạn vui lòng
                  đồng ý tuân thủ các điều khoản này.
                </strong>
              </p>
              <p>
                <strong>1. Đăng ký tài khoản trường học:</strong> Đơn vị trường học phải cung cấp
                thông tin chính xác và đầy đủ khi đăng ký tài khoản. Tài khoản trường học sẽ được quản trị viên xem xét và phê duyệt trước khi có thể sử dụng đầy đủ tính năng. Nếu thông tin
                không chính xác, chúng tôi có quyền từ chối, khóa hoặc xóa tài khoản của
                đơn vị trường học mà không cần thông báo trước.
              </p>
              <p>
                <strong>2. Sử dụng dịch vụ:</strong> Ứng dụng SchoolTV cung cấp dịch
                vụ livestream các môn học và sự kiện trường học, cho phép đơn vị trường học
                đăng tải bài viết và nội dung liên quan đến hoạt động giáo dục.
                Đơn vị trường học cam kết sử dụng dịch vụ của SchoolTV một cách hợp pháp, không vi
                phạm quyền lợi của người khác, không sử dụng dịch vụ vào mục đích
                xâm hại đến lợi ích, quyền lợi của các bên liên quan.
              </p>
              <p>
                <strong>3. Nội dung trường học:</strong> Đơn vị trường học có quyền đăng tải nội
                dung (video, hình ảnh, bài viết) lên ứng dụng. Tuy nhiên, đơn vị cam
                kết rằng các nội dung này không vi phạm bản quyền, quyền riêng tư
                hoặc các quy định pháp lý khác. SchoolTV có quyền xóa hoặc chỉnh sửa
                các nội dung vi phạm các quy định hoặc có hại cho cộng đồng người
                dùng.
              </p>
              <p>
                <strong>4. Trách nhiệm về nội dung giáo dục:</strong> Đơn vị trường học chịu trách nhiệm về tính chính xác và chất lượng của nội dung giáo dục được cung cấp trên nền tảng. Các nội dung phải phù hợp với chương trình giáo dục và tuân thủ các quy định về giáo dục của Việt Nam.
              </p>
              <p>
                <strong>5. Quyền sở hữu trí tuệ:</strong> Tất cả các quyền sở hữu
                trí tuệ liên quan đến ứng dụng SchoolTV, bao gồm giao diện, mã
                nguồn, thiết kế, và các tính năng của ứng dụng đều thuộc về chúng
                tôi hoặc các bên cấp phép. Đơn vị trường học không được phép sao chép, thay
                đổi hoặc phát tán bất kỳ phần nào của ứng dụng nếu không có sự đồng
                ý bằng văn bản của chúng tôi.
              </p>
              <p>
                <strong>6. Giới hạn trách nhiệm:</strong> Chúng tôi không chịu trách
                nhiệm đối với bất kỳ thiệt hại nào phát sinh từ việc sử dụng ứng
                dụng SchoolTV, bao gồm các sự cố về kết nối mạng, lỗi phần mềm hoặc
                các vấn đề không mong muốn khác. SchoolTV không chịu trách nhiệm cho
                nội dung trường học đăng tải. Đơn vị trường học hoàn toàn chịu trách nhiệm về các
                bài viết và livestream của mình.
              </p>
            </div>
            <div className="school-register-modal-footer">
              <button 
                className="school-register-modal-button"
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

export default SchoolRegister;