import "./login.scss";
import { useContext } from 'react';
import {
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
  Form,
  Input,
  notification,
} from "antd";
import { useResponsive } from "antd-style";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext"; 
import axios from "axios";

const API_URL = "https://localhost:44316/api/accounts/login";

function Login() {
  const { theme } = useContext(ThemeContext);
  const { xxl } = useResponsive();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(API_URL, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data) {
        console.log('Login response:', response.data);

        // Extract token and accountID from the correct structure
        const { token, account } = response.data;

        if (token && account?.accountID) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("accountID", account.accountID);

          // Store additional user info if needed
          localStorage.setItem("userData", JSON.stringify({
            username: account.username,
            email: account.email,
            fullname: account.fullname,
            roleName: account.roleName
          }));

          notification.success({
            message: "Đăng nhập thành công!",
            description: "Chào mừng bạn quay trở lại!",
            placement: "topRight",
            duration: 3,
          });

          navigate("/watchHome");
        } else {
          throw new Error('Invalid response format');
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      notification.error({
        message: "Đăng nhập thất bại!",
        description: error.response?.status === 401
          ? "Email hoặc mật khẩu của bạn đã sai! Hãy kiểm tra lại."
          : "Có lỗi xảy ra trong quá trình đăng nhập, vui lòng thử lại.",
        placement: "topRight",
        duration: 5,
      });
    }
  };

  const onFinishFailed = () => {
    notification.warning({
      message: "Vui lòng kiểm tra lại thông tin đăng nhập!",
      description: "Bạn cần nhập đầy đủ thông tin trước khi đăng nhập.",
      placement: "topRight",
      duration: 5,
    });
  };

  return (
    <div className="login_background" data-theme={theme}>
      <Form
        layout="vertical"
        className="login_form"
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h1>Chào mừng trở lại</h1>
        <p>Đăng nhập để tiếp tục hành trình của bạn</p>

        <Form.Item style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <ConfigProvider componentSize={xxl ? "middle" : "small"}>
            <Button
              type="default"
              style={{
                width: '100%',
                maxWidth: '320px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                borderRadius: '10px',
                fontSize: '1em',
                fontWeight: '500'
              }}
              icon={
                <img
                  src="https://img.icons8.com/color/24/000000/google-logo.png"
                  alt="Google Icon"
                  style={{ width: '20px', height: '20px' }}
                />
              }
              onClick={() => window.location.href = "https://www.google.com"}
            >
              Tiếp tục với Google
            </Button>
          </ConfigProvider>
        </Form.Item>

        <div className="login_divider">
          <Divider>Hoặc</Divider>
        </div>

        <Form.Item
          label="Địa chỉ Email"
          name="email"
          className="login_input"
          rules={[
            {
              required: true,
              message: "Nhập email của bạn!",
            },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input className="custom-input" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          className="login_input"
          rules={[
            {
              required: true,
              message: "Hãy nhập mật khẩu của bạn!",
            },
          ]}
        >
          <Input.Password className="custom-input" />
        </Form.Item>

        <Form.Item>
          <div className="remember-password-container">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ mình nhé</Checkbox>
            </Form.Item>
            <a href="/forgottenPassword">Quên mật khẩu?</a>
          </div>
        </Form.Item>

        <Form.Item>
          <div className="login_btn">
            <Button type="primary" htmlType="submit" className="login_btn_ant">
              Đăng nhập
            </Button>
          </div>
        </Form.Item>

        <div className="login_register">
          <span>Chưa có tài khoản? </span>
          <a href="/register">Đăng ký ngay</a>
        </div>
      </Form>
    </div>
  );
}

export default Login;