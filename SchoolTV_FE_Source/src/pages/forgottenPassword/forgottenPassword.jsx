import React, { useState, useContext, useEffect, useRef } from "react";
import { Input, Button, Steps, ConfigProvider, theme, notification, Form, Spin } from "antd";
import {
  MailOutlined,
  LockOutlined,
  CheckCircleFilled,
  SecurityScanOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import "./forgottenPassword.scss";

const { Step } = Steps;

const ForgottenPassword = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const timerRef = useRef(null);
  const { theme: currentTheme } = useContext(ThemeContext);

  const themeConfig = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#4299e1',
      borderRadius: 12,
    },
  };

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [resendTimer]);

  const handleEmailSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://localhost:7057/api/accounts/forgot-password', {
        email: values.email
      });
  
      if (response.status === 200) {
        setUserEmail(values.email);
        setCurrentStep(1);
        setResendTimer(60);
        notification.success({
          message: "Gửi email thành công!",
          description: "Email xác nhận đã được gửi thành công!",
          placement: "topRight",
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: "Gửi email thất bại!",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau!",
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await axios.post('https://localhost:7057/api/accounts/forgot-password', {
        email: userEmail
      });
      setResendTimer(60);
      notification.success({
        message: "Gửi lại email thành công!",
        description: "Email xác nhận đã được gửi lại thành công!",
        placement: "topRight",
        duration: 3,
      });
    } catch (error) {
      notification.error({
        message: "Gửi lại email thất bại!",
        description: "Không thể gửi lại email. Vui lòng thử lại sau!",
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://localhost:7057/api/accounts/reset-password', {
        email: userEmail,
        token: values.token,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword
      });
  
      if (response.status === 200) {
        setIsResetSuccess(true);
        setCurrentStep(3);
        notification.success({
          message: "Đặt lại mật khẩu thành công!",
          description: "Bạn có thể đăng nhập bằng mật khẩu mới của mình.",
          placement: "topRight",
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: "Đặt lại mật khẩu thất bại!",
        description: error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại!',
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = (_, value) => {
    if (!value) {
      return Promise.reject('Vui lòng nhập mật khẩu');
    }
    if (value.includes('.')) {
      return Promise.reject('Mật khẩu không được chứa dấu chấm (.)');
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(value)) {
      return Promise.reject(
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
      );
    }
    return Promise.resolve();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={form} onFinish={handleEmailSubmit} layout="vertical">
            <Form.Item
              name="email"
              label="Địa chỉ email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
              className="fp-form-item"
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email đã đăng ký"
                className="fp-input"
                size="large"
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="fp-button"
            >
              Gửi Mã Xác Nhận
            </Button>
          </Form>
        );

      case 1:
        return (
          <div className="fp-success">
            <div className="success-icon">
              <CheckCircleFilled style={{ fontSize: '40px' }} />
            </div>
            <h3>Email đã được gửi!</h3>
            <p>
              Chúng tôi đã gửi email xác nhận đến <strong>{userEmail}</strong>.
              <br />Vui lòng kiểm tra hộp thư của bạn (bao gồm thư rác).
            </p>

            <div className="fp-resend">
              {resendTimer > 0 ? (
                <p>Có thể gửi lại sau: {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}</p>
              ) : (
                <Button
                  onClick={handleResendEmail}
                  loading={isLoading}
                  className="fp-button"
                >
                  Gửi Lại Email
                </Button>
              )}
            </div>

            <Button
              type="primary"
              onClick={() => setCurrentStep(2)}
              block
              className="fp-button"
            >
              Tiếp Tục Đặt Lại Mật Khẩu
            </Button>
          </div>
        );

      case 2:
        return (
          <Form form={form} onFinish={handlePasswordReset} layout="vertical">
            <Form.Item
              name="token"
              label="Mã xác nhận"
              rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận' }]}
              className="fp-form-item"
            >
              <Input
                prefix={<SecurityScanOutlined />}
                placeholder="Nhập mã xác nhận từ email"
                className="fp-input"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ validator: passwordValidation }]}
              className="fp-form-item"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu mới"
                className="fp-input"
              />
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
              label="Xác nhận mật khẩu"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Mật khẩu xác nhận không khớp');
                  },
                }),
              ]}
              className="fp-form-item"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập lại mật khẩu mới"
                className="fp-input"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="fp-button"
            >
              Xác Nhận Đặt Lại Mật Khẩu
            </Button>
          </Form>
        );

      case 3:
        return (
          <div className="fp-success">
            <div className="success-icon">
              <CheckCircleFilled style={{ fontSize: '40px' }} />
            </div>
            <h3>Đặt Lại Mật Khẩu Thành Công!</h3>
            <p>Bạn có thể đăng nhập bằng mật khẩu mới của mình.</p>
            <Button
              type="primary"
              href="/login"
              block
              className="fp-button"
              style={{ marginTop: '20px' }}
            >
              Đăng Nhập
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div className="fp-modern-container" data-theme={currentTheme}>
        <div className="fp-modern-box">
          <div className="fp-header">
            <h2>Khôi Phục Mật Khẩu</h2>
            <p>Đừng lo lắng! Chúng tôi sẽ giúp bạn khôi phục tài khoản</p>
          </div>

          <Steps
            current={currentStep}
            className="fp-steps"
            items={[
              { title: 'Email' },
              { title: 'Xác nhận' },
              { title: 'Mật khẩu mới' }
            ]}
          />

          {renderStepContent()}

          {currentStep < 3 && (
            <div className="fp-back">
              <a href="/login" className="fp-back-link">
                <ArrowLeftOutlined />
                Quay lại đăng nhập
              </a>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ForgottenPassword;