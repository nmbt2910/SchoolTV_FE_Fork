import { Button, Checkbox, Form, Input, message } from 'antd';
import './register.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://localhost:44316/api/Account/signup';

function Register() {
  const [form] = Form.useForm();
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleFinish = async (values) => {
    console.log('Data sent to API:', values); // Debug để kiểm tra dữ liệu gửi đi
    try {
      const response = await axios.post(API_URL, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200 || response.status === 201) {
        message.success('Đăng ký thành công!');
        form.resetFields();
      }
    } catch (error) {
      // Debug lỗi trả về từ API
      console.error('API Error:', error.response?.data || error.message);
      message.error(
        error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!'
      );
    }
  };  

  const handleButtonClick = () => {
    if (!agreeTerms) {
      message.error('Bạn cần đồng ý với các điều khoản trước khi tạo tài khoản !');
      return;
    }
    form.submit(); 
  };

  return (
    <div className="register_background">
      <div className="register_form">
          <h1>Hãy bắt đầu với một Tài khoản mới</h1>
          <h3>Tham gia School TV ngay hôm nay để bắt đầu hành trình tại đại học của bạn một cách hoàn hảo nhất !</h3>
          
          <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="register_form_wrapper"
        >
          <div className="register_left">
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}
            >
              <Input placeholder="Nhập Username của bạn" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập Email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="Nhập địa chỉ Email của bạn" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              ]}
            >
              <Input.Password 
                placeholder="Hãy tạo một mật khẩu mạnh" 
                />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận Mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận lại mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                placeholder="Xác nhận lại mật khẩu của bạn"  
              />
            </Form.Item>
          </div>

          <div className="register_right">
            <Form.Item
              name="fullname"
              label="Họ và Tên"
              rules={[{ required: true, message: 'Vui lòng nhập Họ và Tên!' }]}
            >
              <Input placeholder="Nhập Họ và Tên của bạn" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
              ]}
            >
              <Input placeholder="Nhập số điện thoại liên hệ của bạn" />
            </Form.Item>

            <Form.Item
              className="register_add"
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input placeholder="Nhập địa chỉ liên hệ của bạn" />
            </Form.Item>
          </div>
        </Form>

          <div className="register_check">
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}              
              >
                <a>Tôi đồng ý với những</a> <Link to="#">Điều khoản </Link>
              </Checkbox>
          </div>

          <div className="register_btn">       
            <Button type="primary" onClick={handleButtonClick}>
              Tạo Tài khoản
            </Button>
          </div>

          <div className="register_signin">
              Bạn đã có tài khoản rồi ? 
          </div>

          <div className="register_signin1">
            <Link to="/login" className="register_signin2">Đăng nhập tại đây</Link>
          </div>

      </div>
    </div>
  )
}

export default Register;