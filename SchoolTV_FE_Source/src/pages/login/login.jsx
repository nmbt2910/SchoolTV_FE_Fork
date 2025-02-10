import "./login.scss";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
  Flex,
  Form,
  Input,
  message,
  notification,
} from "antd";
import { useResponsive } from "antd-style";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = "https://localhost:44316/api/accounts/login";

function Login() {
  const { xxl } = useResponsive();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(API_URL, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        notification.success({
          message: "Đăng nhập thành công!",
          description: "Chào mừng bạn quay trở lại!",
          placement: "topRight",
          duration: 3,
        });

        localStorage.setItem("authToken", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      if (error.response && error.response.status === 401) {
        notification.error({
          message: "Đăng nhập thất bại!",
          description: "Email hoặc mật khẩu của bạn đã sai! Hãy kiểm tra lại.",
          placement: "topRight",
          duration: 5,
        });
      } else {
        notification.error({
          message: "Lỗi hệ thống!",
          description: "Không thể kết nối đến máy chủ, vui lòng thử lại sau.",
          placement: "topRight",
          duration: 5,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    notification.warning({
      message: "Vui lòng kiểm tra lại thông tin đăng nhập!",
      description: "Bạn cần nhập đầy đủ thông tin trước khi đăng nhập.",
      placement: "topRight",
      duration: 5,
    });
  };

  return (
    <div className="login_background">
      <Form
        layout="vertical"
        className="login_form"
        name="login"
        style={{
          width: "23%",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h1>Chào mừng trở lại</h1>
        <p>Đăng nhập để tiếp tục hành trình của bạn</p>

        <Form.Item
          wrapperCol={{
            offset: 2,
            span: 16,
          }}
        >
          <ConfigProvider componentSize={xxl ? "middle" : "small"}>
            <Flex vertical gap="small">
              <Button
                type="default"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  height: "40px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "125%",
                }}
                icon={
                  <img
                    src="https://img.icons8.com/color/24/000000/google-logo.png"
                    alt="Google Icon"
                    style={{ height: "20px", width: "20px" }}
                  />
                }
                onClick={() => {
                  window.location.href = "https://www.google.com";
                }}
              >
                Tiếp tục với Google
              </Button>
            </Flex>
          </ConfigProvider>
        </Form.Item>

        <div className="login_divider">
          <Divider
            style={{
              borderColor: "#D0D0D0",
            }}
          >
            Hoặc
          </Divider>
        </div>

        <Form.Item
          label="Địa chỉ Email"
          name="email"
          className="login_input"
          wrapperCol={{
            span: 22,
          }}
          rules={[
            {
              required: true,
              message: "Nhập email của bạn!",
            },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          className="login_input"
          wrapperCol={{
            span: 22,
          }}
          rules={[
            {
              required: true,
              message: "Hãy nhập mật khẩu của bạn!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null} className="remember-password">
          <div className="remember-password-container">
            <Checkbox>Remember me</Checkbox>
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>
        </Form.Item>

        <Form.Item>
          <div className="login_btn">
            <Button type="primary" htmlType="submit" className="login_btn_ant">
              Đăng nhập
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <div className="login_register">
            <span> Chưa có tài khoản ? </span>
            <a href="/register">Đăng ký ngay</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
