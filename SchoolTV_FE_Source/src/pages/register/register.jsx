import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  ConfigProvider,
} from "antd";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";

function Register() {
  const { theme } = useContext(ThemeContext);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
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
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      phoneNumber: values.phoneNumber,
      fullName: values.fullname,
      address: values.address,
      role: values.role,
    };

    try {
      const response = await axios.post(
        "https://localhost:44316/api/accounts/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: "Đăng ký thành công!",
          description: "Bạn có thể đăng nhập ngay bây giờ.",
          placement: "topRight",
          duration: 5,
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
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
    <div className="register_background" data-theme={theme}>
      <div className="register_form">
        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <h1>Hãy bắt đầu với Một tài khoản mới</h1>
          <p>Tham gia SchoolTV ngay hôm nay để bắt đầu một hành trình tại đại học của bạn một cách hoàn hảo nhất!</p>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                className="register_input"
                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
              >
                <Input placeholder="Chọn tên đăng nhập" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                className="register_input"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" }
                ]}
              >
                <Input placeholder="Nhập email của bạn" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                className="register_input"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" }
                ]}
              >
                <Input.Password placeholder="Tạo mật khẩu" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Họ và tên"
                name="fullname"
                className="register_input"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên của bạn" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                className="register_input"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: /^\d{10}$/, message: "Số điện thoại không hợp lệ" }
                ]}
              >
                <Input placeholder="Nhập số điện thoại của bạn" />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                className="register_input"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Địa chỉ"
            name="address"
            className="register_input"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input placeholder="Nhập địa chỉ của bạn" />
          </Form.Item>

          <Form.Item className="terms_checkbox">
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            >
              <span>Tôi đồng ý với </span>
              <span
                className="register_clause"
                onClick={() => setIsModalVisible(true)}
              >
                Điều khoản và Điều kiện
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="register_btn"
            >
              Tạo Tài Khoản
            </Button>
          </Form.Item>

          <div className="register_foot">
            <span>Bạn đã có tài khoản? </span>
            <Link to="/login" className="register_signin">
              Đăng nhập
            </Link>
          </div>
        </Form>
      </div>

      <Modal
        title="Điều khoản và Điều kiện"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsModalVisible(false)}>
            Tôi đã hiểu
          </Button>,
        ]}
      >
        {/* Modal content remains the same */}
      </Modal>
    </div>
  );
}

export default Register;