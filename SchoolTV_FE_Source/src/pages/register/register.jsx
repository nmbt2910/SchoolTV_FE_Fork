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
} from "antd";
import { useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";

function Register() {
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
        console.log("Lỗi từ API:", error.response.data);

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
      } else if (error.request) {
        notification.error({
          message: "Lỗi kết nối!",
          description:
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng của bạn.",
          placement: "topRight",
          duration: 5,
        });
      } else {
        notification.error({
          message: "Lỗi không xác định!",
          description: "Có lỗi xảy ra, vui lòng thử lại.",
          placement: "topRight",
          duration: 5,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="register_background">
      <div className="register_form">
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          style={{
            height: "600px",
          }}
        >
          <h1>Hãy bắt đầu với tài khoản mới</h1>
          <p>
            Tham gia SchoolTV ngay hôm nay để bắt đầu một hành trình tại đại học
            của bạn một cách hoàn hảo nhất!
          </p>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập Username!" }]}
              >
                <Input placeholder="Nhập tên đăng nhập của bạn" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email của bạn" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                tooltip={{
                  title:
                    "Mật khẩu cần 1 ký tự viết hoa, 1 ký tự đặc biệt, 1 số",
                  icon: <InfoCircleOutlined />,
                }}
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                label="Họ và tên"
                name="fullname"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên của bạn" />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
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
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center">
            <Col span={24}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input placeholder="Nhập địa chỉ của bạn" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            >
              <span>Tôi đồng ý với những </span>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                className="register_clause"
                onClick={showModal}
              >
                Điều khoản
              </span>
            </Checkbox>
          </Form.Item>

          <Row justify="center">
            <Col>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "600px",
                    marginTop: "-5px",
                  }}
                >
                  Tạo tài khoản
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <div className="register_foot">
              <span>Bạn đã có tài khoản rồi sao ? </span>
              <Link to="/login" className="register_signin">
                Đăng nhập tại đây
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>

      <Modal
        title="ĐIỀU KHOẢN VÀ ĐIỀU KIỆN SỬ DỤNG"
        open={isModalVisible}
        footer={[
          <Button key="ok" type="primary" onClick={handleCloseModal}>
            Tôi đã hiểu
          </Button>,
        ]}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <p>
            <strong>
              Chào mừng bạn đến với ứng dụng SchoolTV! Trước khi sử dụng dịch vụ
              của chúng tôi, vui lòng đọc kỹ các điều khoản và điều kiện sau
              đây. Khi bạn đăng ký tài khoản hoặc sử dụng dịch vụ, bạn vui lòng
              đồng ý tuân thủ các điều khoản này.
            </strong>
          </p>
          <p>
            <strong>1. Đăng ký tài khoản:</strong> Người dùng phải cung cấp
            thông tin chính xác và đầy đủ khi đăng ký tài khoản. Nếu thông tin
            không chính xác, chúng tôi có quyền khóa hoặc xóa tài khoản của
            người dùng mà không cần thông báo trước. Bạn cam kết bảo vệ mật khẩu
            và thông tin đăng nhập của mình. Bạn sẽ chịu trách nhiệm cho tất cả
            các hoạt động xảy ra dưới tài khoản của bạn.
          </p>
          <p>
            <strong>2. Sử dụng dịch vụ:</strong> Ứng dụng SchoolTV cung cấp dịch
            vụ livestream các môn học và sự kiện trường học, cho phép người dùng
            đăng tải bài viết và nội dung liên quan đến hoạt động trường học.
            Bạn cam kết sử dụng dịch vụ của SchoolTV một cách hợp pháp, không vi
            phạm quyền lợi của người khác, không sử dụng dịch vụ vào mục đích
            xâm hại đến lợi ích, quyền lợi của các bên liên quan.
          </p>
          <p>
            <strong>3. Nội dung người dùng:</strong> Bạn có quyền đăng tải nội
            dung (video, hình ảnh, bài viết) lên ứng dụng. Tuy nhiên, bạn cam
            kết rằng các nội dung này không vi phạm bản quyền, quyền riêng tư
            hoặc các quy định pháp lý khác. SchoolTV có quyền xóa hoặc chỉnh sửa
            các nội dung vi phạm các quy định hoặc có hại cho cộng đồng người
            dùng.
          </p>
          <p>
            <strong>4. Bảo mật và quyền riêng tư:</strong> Chúng tôi cam kết bảo
            vệ thông tin cá nhân của bạn theo chính sách bảo mật của chúng tôi.
            Bạn có thể tham khảo chi tiết trong Chính Sách Bảo Mật. Bạn chịu
            trách nhiệm bảo mật thông tin tài khoản của mình. Nếu phát hiện có
            bất kỳ hành vi truy cập trái phép nào, bạn phải thông báo ngay cho
            chúng tôi.
          </p>
          <p>
            <strong>5. Quyền sở hữu trí tuệ:</strong> Tất cả các quyền sở hữu
            trí tuệ liên quan đến ứng dụng SchoolTV, bao gồm giao diện, mã
            nguồn, thiết kế, và các tính năng của ứng dụng đều thuộc về chúng
            tôi hoặc các bên cấp phép. Người dùng không được phép sao chép, thay
            đổi hoặc phát tán bất kỳ phần nào của ứng dụng nếu không có sự đồng
            ý bằng văn bản của chúng tôi.
          </p>
          <p>
            <strong>6. Giới hạn trách nhiệm:</strong>Chúng tôi không chịu trách
            nhiệm đối với bất kỳ thiệt hại nào phát sinh từ việc sử dụng ứng
            dụng SchoolTV, bao gồm các sự cố về kết nối mạng, lỗi phần mềm hoặc
            các vấn đề không mong muốn khác. SchoolTV không chịu trách nhiệm cho
            nội dung người dùng đăng tải. Bạn hoàn toàn chịu trách nhiệm về các
            bài viết và livestream của mình.
          </p>
          <p>
            <strong>7. Chấm dứt tài khoản:</strong>Chúng tôi có quyền đình chỉ
            hoặc xóa tài khoản của bạn nếu phát hiện hành vi vi phạm các điều
            khoản sử dụng hoặc các quy định pháp lý. Bạn có thể yêu cầu xóa tài
            khoản của mình bất cứ lúc nào bằng cách liên hệ với chúng tôi qua
            phương thức hỗ trợ.
          </p>
          <p>
            <strong>8. Sửa đổi điều khoản:</strong>Chúng tôi có quyền sửa đổi,
            bổ sung các điều khoản này vào bất kỳ lúc nào. Mọi thay đổi sẽ được
            thông báo trên ứng dụng và có hiệu lực ngay khi được công bố.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Register;
