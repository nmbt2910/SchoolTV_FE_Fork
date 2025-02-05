import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import "./register.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API_URL = "https://localhost:44316/api/accounts/register";

function Register() {
  const [form] = Form.useForm();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFinish = async (values) => {
    console.log("Data sent to API:", values);
    try {
      const response = await axios.post(API_URL, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Đăng ký thành công!");
        form.resetFields();
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);

      if (error.response) {
        const errorMessage =
          error.response.data.message || "Đăng ký thất bại. Vui lòng thử lại!";

        if (error.response.status === 409) {
          if (errorMessage.includes("Username")) {
            message.error("Tên người dùng đã tồn tại. Vui lòng chọn tên khác!");
          } else if (errorMessage.includes("Email")) {
            message.error(
              "Email này đã được sử dụng. Vui lòng chọn email khác!"
            );
          } else {
            message.error(
              "Tài khoản đã tồn tại. Vui lòng sử dụng thông tin khác!"
            );
          }
        } else {
          message.error(errorMessage);
        }
      } else {
        message.error("Đăng ký thất bại. Vui lòng kiểm tra lại kết nối!");
      }
    }
  };

  const handleButtonClick = () => {
    if (!agreeTerms) {
      message.error(
        "Bạn cần đồng ý với các điều khoản trước khi tạo tài khoản !"
      );
      return;
    }
    form.submit();
  };

  const showTermsModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="register_background">
      <div className="register_form">
        <h1>Hãy bắt đầu với một Tài khoản mới</h1>
        <h3>
          Tham gia School TV ngay hôm nay để bắt đầu hành trình tại đại học của
          bạn một cách hoàn hảo nhất !
        </h3>

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
              rules={[{ required: true, message: "Vui lòng nhập Username!" }]}
            >
              <Input placeholder="Nhập Username của bạn" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập Email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập địa chỉ Email của bạn" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password placeholder="Hãy tạo một mật khẩu mạnh" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận Mật khẩu"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận lại mật khẩu!" },
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
              <Input.Password placeholder="Xác nhận lại mật khẩu của bạn" />
            </Form.Item>
          </div>

          <div className="register_right">
            <Form.Item
              name="fullname"
              label="Họ và Tên"
              rules={[{ required: true, message: "Vui lòng nhập Họ và Tên!" }]}
            >
              <Input placeholder="Nhập Họ và Tên của bạn" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại liên hệ của bạn" />
            </Form.Item>

            <Form.Item
              className="register_add"
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
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
            <a>Tôi đồng ý với những</a>{" "}
            <Link to="#" onClick={showTermsModal}>
              Điều khoản{" "}
            </Link>
          </Checkbox>
        </div>

        <div className="register_btn">
          <Button type="primary" onClick={handleButtonClick}>
            Tạo Tài khoản
          </Button>
        </div>

        <div className="register_signin">Bạn đã có tài khoản rồi ?</div>

        <div className="register_signin1">
          <Link to="/login" className="register_signin2">
            Đăng nhập tại đây
          </Link>
        </div>
      </div>

      {/* Điều khoản */}
      <Modal
        title="Điều khoản sử dụng"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          Chào mừng bạn đến với ứng dụng SchoolTV! Trước khi sử dụng dịch vụ của
          chúng tôi, vui lòng đọc kỹ các điều khoản và điều kiện sau đây. Khi
          bạn đăng ký tài khoản hoặc sử dụng dịch vụ, bạn vui lòng đồng ý tuân
          thủ các điều khoản này.
        </p>
        <p>1. Đăng ký tài khoản:</p>
        <span>
          Người dùng phải cung cấp thông tin chính xác và đầy đủ khi đăng ký tài
          khoản. Nếu thông tin không chính xác, chúng tôi có quyền khóa hoặc xóa
          tài khoản của người dùng mà không cần thông báo trước. Bạn cam kết bảo
          vệ mật khẩu và thông tin đăng nhập của mình. Bạn sẽ chịu trách nhiệm
          cho tất cả các hoạt động xảy ra dưới tài khoản của bạn.
        </span>

        <p>2. Sử dụng dịch vụ: </p>
        <span>
          Ứng dụng SchoolTV cung cấp dịch vụ livestream các môn học và sự kiện
          trường học, cho phép người dùng đăng tải bài viết và nội dung liên
          quan đến hoạt động trường học. Bạn cam kết sử dụng dịch vụ của
          SchoolTV một cách hợp pháp, không vi phạm quyền lợi của người khác,
          không sử dụng dịch vụ vào mục đích xâm hại đến lợi ích, quyền lợi của
          các bên liên quan.
        </span>

        <p>3. Nội dung người dùng: </p>
        <span>
          Bạn có quyền đăng tải nội dung (video, hình ảnh, bài viết) lên ứng
          dụng. Tuy nhiên, bạn cam kết rằng các nội dung này không vi phạm bản
          quyền, quyền riêng tư hoặc các quy định pháp lý khác. SchoolTV có
          quyền xóa hoặc chỉnh sửa các nội dung vi phạm các quy định hoặc có hại
          cho cộng đồng người dùng.
        </span>

        <p>4. Bảo mật và quyền riêng tư: </p>
        <span>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo chính sách bảo
          mật của chúng tôi. Bạn có thể tham khảo chi tiết trong Chính Sách Bảo
          Mật. Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình. Nếu
          phát hiện có bất kỳ hành vi truy cập trái phép nào, bạn phải thông báo
          ngay cho chúng tôi.
        </span>

        <p>5. Quyền sở hữu trí tuệ: </p>
        <span>
          Tất cả các quyền sở hữu trí tuệ liên quan đến ứng dụng SchoolTV, bao
          gồm giao diện, mã nguồn, thiết kế, và các tính năng của ứng dụng đều
          thuộc về chúng tôi hoặc các bên cấp phép. Người dùng không được phép
          sao chép, thay đổi hoặc phát tán bất kỳ phần nào của ứng dụng nếu
          không có sự đồng ý bằng văn bản của chúng tôi.
        </span>

        <p>6. Giới hạn trách nhiệm: </p>
        <span>
          Chúng tôi không chịu trách nhiệm đối với bất kỳ thiệt hại nào phát
          sinh từ việc sử dụng ứng dụng SchoolTV, bao gồm các sự cố về kết nối
          mạng, lỗi phần mềm hoặc các vấn đề không mong muốn khác. SchoolTV
          không chịu trách nhiệm cho nội dung người dùng đăng tải. Bạn hoàn toàn
          chịu trách nhiệm về các bài viết và livestream của mình.
        </span>

        <p>7. Chấm dứt tài khoản: </p>
        <span>
          Chúng tôi có quyền đình chỉ hoặc xóa tài khoản của bạn nếu phát hiện
          hành vi vi phạm các điều khoản sử dụng hoặc các quy định pháp lý. Bạn
          có thể yêu cầu xóa tài khoản của mình bất cứ lúc nào bằng cách liên hệ
          với chúng tôi qua phương thức hỗ trợ.
        </span>

        <p>8. Sửa đổi điều khoản: </p>
        <span>
          Chúng tôi có quyền sửa đổi, bổ sung các điều khoản này vào bất kỳ lúc
          nào. Mọi thay đổi sẽ được thông báo trên ứng dụng và có hiệu lực ngay
          khi được công bố.
        </span>
      </Modal>
    </div>
  );
}

export default Register;
