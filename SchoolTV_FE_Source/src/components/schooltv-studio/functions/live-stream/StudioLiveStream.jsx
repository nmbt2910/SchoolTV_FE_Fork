import React from "react";
import "./StudioLiveStream.scss";
import { Button, Col, Form, Input, Row, Space, Divider } from "antd";
import { message, Upload } from "antd";
import { FaBroadcastTower, FaPlay } from "react-icons/fa";
import { FaImage } from "react-icons/fa";

const { TextArea } = Input;
const { Dragger } = Upload;

function StudioLiveStream() {
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
    <div className="studio-live-container">
      {/* Class applied from main title of SChoolChannelStudio.scss */}
      <h1 className="studio-function-title">Cài đặt Live Stream</h1>
      <div className="studio-live-content">
        <Row gutter={16}>
          <Col className="gutter-row" span={16}>
            <div
              style={{
                width: "100%",
                maxWidth: "800px",
                aspectRatio: "16/9",
                background: "#222",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
              }}
            >
              <span style={{ color: "red" }}>
                <Space>
                  <FaBroadcastTower />
                  Chuẩn bị stream...
                </Space>
              </span>
            </div>

            <Form layout="vertical">
              <Form.Item
                label={<h2 className="studio-live-des">Tiêu đề</h2>}
                name="liveTitle"
              >
                <Input
                  className="studio-live-input"
                  placeholder="Nhập tiêu đề cho buổi live stream của bạn"
                />
              </Form.Item>

              <Form.Item
                label={<h2 className="studio-live-des">Mô tả</h2>}
                name="liveDescription"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả cho buổi live stream!",
                  },
                ]}
              >
                <TextArea
                  className="studio-live-input"
                  placeholder="Mô tả chi tiết về nội dung buổi live stream"
                  rows={4}
                />
              </Form.Item>

              <Form.Item
                label={<h2 className="studio-live-des">Thumbnail</h2>}
                name="liveThumbnail"
              >
                <Dragger className="studio-live-dragger" {...props}>
                  <p className="ant-upload-drag-icon">
                    <FaImage style={{ fontSize: 50 }} />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả hoặc click để tải thumbnail lên
                  </p>
                  <p className="ant-upload-hint">
                    Nghiêm cấm tải các tệp vi phạm bản quyền hoặc không phù hợp.
                  </p>
                </Dragger>
              </Form.Item>

              <Button className="studio-live-button" htmlType="submit">
                <Space>
                  <FaPlay />
                  Bắt đầu Live Stream
                </Space>
              </Button>
            </Form>
          </Col>

          <Col className="gutter-row" span={8}>
            <h2 class="analytics-title">Analytics</h2>
            <div class="analytics-container">
              <div class="analytics-item">
                <h3>Người xem hiện tại</h3>
                <p class="analytics-value">0</p>
                <Divider />
              </div>

              <div class="analytics-item">
                <h3>Lượt thích</h3>
                <p class="analytics-value">0</p>
                <Divider />
              </div>

              <div class="analytics-item">
                <h3>Thời gian stream</h3>
                <p class="analytics-value">00:00:00</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default StudioLiveStream;
