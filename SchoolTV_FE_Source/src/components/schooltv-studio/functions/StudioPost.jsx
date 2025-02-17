import React, { useState } from "react";
import "./StudioPost.scss";
import { Button, Flex, Form, Input } from "antd";
import { message, Upload } from "antd";
import { FaImage, FaUserFriends } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";

const { TextArea } = Input;
const { Dragger } = Upload;

function StudioPost() {
  const [postStatus, setPostStatus] = useState(null);

  const getStatus = (status) => {
    setPostStatus(status);
    console.log(status);
  };

  const props = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="studio-post-container">
      {/* Class applied from main title of SChoolChannelStudio.scss */}
      <h1 className="studio-function-title">Tuỳ chỉnh bài viết của bạn</h1>
      <div className="studio-post-content">
        <Form layout="vertical">
          <Form.Item
            label={<h2 className="studio-post-des">Tiêu đề</h2>}
            name="postTitle"
          >
            <Input className="studio-post-input" placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-post-des">Nội dung</h2>}
            name="postContent"
            rules={[
              {
                required: true,
                message: "Vui lòng nhâp nội dung bài viết!",
              },
            ]}
          >
            <TextArea className="studio-post-input" placeholder="Nhập nội dung bài viết" rows={4} />
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-post-des">Hình ảnh</h2>}
            name="image"
          >
            <Dragger className="studio-post-dragger" {...props}>
              <p className="ant-upload-drag-icon">
                <FaImage style={{ fontSize: 50 }} />
              </p>
              <p className="ant-upload-text">
                Kéo thả hoặc click để tải ảnh lên
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ tải lên một tệp hoặc hàng loạt. Nghiêm cấm tải các tệp vi
                phạm bản quyền hoặc không phù hợp.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-post-des">Trạng thái hiển thị</h2>}
            name="status"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái hiển thị!",
              },
            ]}
          >
            <Flex justify="space-between">
              <div
                onClick={() => getStatus("public")}
                className={`studio-post-status ${
                  postStatus === "public" ? "studio-post-status__active" : ""
                }`}
              >
                <p><FaEarthAmericas /></p>
                <p style={{ fontWeight: "bold" }}>Công khai</p>
                <p>Mọi người có thể xem</p>
              </div>

              <div
                onClick={() => getStatus("private")}
                className={`studio-post-status ${
                  postStatus === "private" ? "studio-post-status__active" : ""
                }`}
              >
                <p><FaUserFriends /></p>
                <p style={{ fontWeight: "bold" }}>Người theo dõi</p>
                <p>Chỉ người theo dõi mới xem được</p>
              </div>
            </Flex>
          </Form.Item>

          <Flex>
            <Button className="studio-post-button">Lưu bản nháp</Button>
            <Button className="studio-post-button">Xem trước</Button>
            <Button className="studio-post-button" htmlType="submit">
              Đăng
            </Button>
          </Flex>
        </Form>
      </div>
    </div>
  );
}

export default StudioPost;
