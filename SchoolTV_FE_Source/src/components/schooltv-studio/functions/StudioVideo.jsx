import React, { useState } from "react";
import "./StudioVideo.scss";
import { Button, Flex, Form, Input, Space, TimePicker } from "antd";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { FaImage, FaUserFriends } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { message, Upload } from "antd";
import { DatePicker } from "antd";

const { Dragger } = Upload;
const { TextArea } = Input;

function StudioVideo() {
  const propsVideo = {
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

  const propsThumbnail = {
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

  const [videoStatus, setVideoStatus] = useState(null);

  const getStatus = (status) => {
    setVideoStatus(status);
    console.log(status);
  };

  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const onTimeChange = (time, timeString) => {
    console.log('Selected Time:', time);
    console.log('Formatted Time:', timeString);
  };
  
  
  return (
    <div className="studio-video-container">
      {/* Class applied from main title of SChoolChannelStudio.scss */}
      <h1 className="studio-function-title">Tuỳ chỉnh video của bạn</h1>

      <div className="studio-video-content">
        <Form layout="vertical">
          <Form.Item
            label={<h2 className="studio-video-des">Video</h2>}
            name="video"
          >
            <Dragger className="studio-video-dragger" {...propsVideo}>
              <p className="ant-upload-drag-icon">
                <MdOutlineOndemandVideo style={{ fontSize: 50 }} />
              </p>
              <p className="ant-upload-text">Kéo thả video vào đây</p>
              <p>hoặc</p>
              <Flex justify="center" style={{ marginTop: "10px" }}>
                <p
                  style={{
                    width: 100,
                    backgroundColor: "#4a90e2",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Chọn file
                </p>
              </Flex>
            </Dragger>
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-video-des">Thumbnail</h2>}
            name="thumbnail"
          >
            <Dragger className="studio-video-dragger" {...propsThumbnail}>
              <p className="ant-upload-drag-icon">
                <FaImage style={{ fontSize: 50 }} />
              </p>
              <p className="ant-upload-text">Tải thumbnail cho video của bạn</p>
              <p className="ant-upload-hint">
                Hỗ trợ tải lên thumbnail, một ảnh đại diện cho nội dung chính
                video của bạn.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-video-des">Tiêu đề</h2>}
            name="videoTitle"
          >
            <Input
              className="studio-video-input"
              placeholder="Nhập tiêu đề video"
            />
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-video-des">Mô tả</h2>}
            name="videoDescription"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả cho video!",
              },
            ]}
          >
            <TextArea
              className="studio-video-input"
              placeholder="Nhập mô tả cho bài viết"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-video-des">Trạng thái hiển thị</h2>}
            name="videoStatus"
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
                className={`studio-video-status ${
                  videoStatus === "public" ? "studio-video-status__active" : ""
                }`}
              >
                <p>
                  <FaEarthAmericas />
                </p>
                <p style={{ fontWeight: "bold" }}>Công khai</p>
                <p>Mọi người có thể xem</p>
              </div>

              <div
                onClick={() => getStatus("private")}
                className={`studio-video-status ${
                  videoStatus === "private" ? "studio-video-status__active" : ""
                }`}
              >
                <p>
                  <FaUserFriends />
                </p>
                <p style={{ fontWeight: "bold" }}>Người theo dõi</p>
                <p>Chỉ người theo dõi mới xem được</p>
              </div>
            </Flex>
          </Form.Item>

          <Form.Item
            label={<h2 className="studio-video-des">Thời gian đăng tải</h2>}
            name="videoTimeUpload"
          >
            <Flex justify="space-between">
              <DatePicker className="video-plan-picker" placeholder="yyyy-mm-dd" style={{ width: "49%" }} onChange={onDateChange} />
              <TimePicker className="video-plan-picker" placeholder="--:--:--" style={{ width: "49%" }} onChange={onTimeChange} />
            </Flex>
          </Form.Item>

          <Button className="studio-video-button" htmlType="submit">
              Đăng
            </Button>
        </Form>
      </div>
    </div>
  );
}

export default StudioVideo;
