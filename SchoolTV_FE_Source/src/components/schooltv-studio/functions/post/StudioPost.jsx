import React, { useEffect, useRef, useState } from "react";
import "./StudioPost.scss";
import { Button, Flex, Form, Input, Switch } from "antd";
import { message, Upload } from "antd";
import { FaImage, FaUserFriends } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { useSelector } from "react-redux";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  toolbarPlugin,
  thematicBreakPlugin,
  diffSourcePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertThematicBreak,
  CodeToggle,
  DiffSourceToggleWrapper,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import StudioPostPreview from "./StudioPostPreview";

const { Dragger } = Upload;

function StudioPost() {
  const user = useSelector((state) => state.userData.user);
  console.log(user);
  const [postStatus, setPostStatus] = useState(null);
  const [form] = Form.useForm();
  const [fileUrlList, setFileUrlList] = useState([]);
  const [previewPostData, setPreviewPostData] = useState({
    owner: user ? user : null,
    Title: "",
    Content: "",
    FollowerMode: null,
    ImageFiles: null,
  });
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 767px)").matches
  );

  const getStatus = (status) => {
    setPostStatus(status);
    form.setFieldsValue({ FollowerMode: status });
  };

  const handleBeforeUpload = (file) => {
    const isValidType = file.type === "image/jpeg" || file.type === "image/png";

    if (!isValidType) {
      message.error("Chỉ cho phép upload file JPG hoặc PNG!");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleChangeImage = (info) => {
    form.setFieldsValue({ ImageFiles: info.fileList });

    //Tạo url xem trước
    const newFileList = info.fileList.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file.originFileObj),
    }));

    setFileUrlList(newFileList);
  };

  //handle rich text
  const handleChangeFormatText = (value) => {
    setPreviewPostData((prev) => ({
      ...prev,
      Content: value,
    }))
  };

  // console.log(previewPostData.Content);

  //Cập nhật text xem trước
  const handleFormChange = (_, allValues) => {
    setPreviewPostData((prev) => ({
      ...prev,
      ...allValues,
    }));
  };

  //Cập nhật hình ảnh xem trước
  useEffect(() => {
    setPreviewPostData((prev) => ({
      ...prev,
      ImageFiles: fileUrlList,
    }));
  }, [fileUrlList]);

  //Câp nhật trạng thái hiển thị xem trước
  useEffect(() => {
    setPreviewPostData((prev) => ({
      ...prev,
      FollowerMode: postStatus,
    }));
  }, [postStatus]);

  //Gửi data hoàn chỉnh về API
  const onFinish = (values) => {
    if (!values.ImageFiles || values.ImageFiles.length === 0) {
      values.ImageFiles = [];
    }
    console.log("Success:", values);
  };

  //Handle menu xem trước bài viết
  const onChangePreviewPost = (checked) => {
    setIsOpenPreview(checked);
    if (checked) {
      if (!isMobile) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  useEffect(() => {
    const postPreviewContainer = document.getElementById(
      "post-preview-container"
    );
    const studioPostLayout = document.getElementById("studio-post-layout");
    const studioPostContainer = document.getElementById(
      "studio-post-container"
    );
    const modalOverlay = document.getElementById("modal-overlay");
    const previewSwitch = document.getElementById("preview-switch");

    if (
      !postPreviewContainer ||
      !studioPostLayout ||
      !studioPostContainer ||
      !modalOverlay ||
      !previewSwitch
    )
      return;

    let closeElement = postPreviewContainer.querySelector(
      ".post-preview-close-btn"
    );
    if (!closeElement) {
      closeElement = document.createElement("div");
      closeElement.innerHTML = "&times;";
      closeElement.className = "post-preview-close-btn";
      closeElement.style.position = "absolute";
      closeElement.style.top = "5px";
      closeElement.style.right = "10px";
      closeElement.style.cursor = "pointer";
      closeElement.style.fontSize = "30px";

      closeElement.addEventListener("click", () => {
        postPreviewContainer.style.display = "none";
        modalOverlay.style.display = "none";
        setIsOpenPreview(false);
      });

      postPreviewContainer.appendChild(closeElement);
    }

    if (isOpenPreview) {
      postPreviewContainer.style.display = "block";
      modalOverlay.style.display = isMobile ? "block" : "none";

      if (isMobile) {
        studioPostLayout.style.display = "block";
        studioPostContainer.style.width = "100%";
        postPreviewContainer.style.position = "fixed";
        postPreviewContainer.style.top = "50%";
        postPreviewContainer.style.left = "50%";
        postPreviewContainer.style.transform = "translate(-50%, -50%)";
        postPreviewContainer.style.zIndex = 1000;
        postPreviewContainer.style.width = "80%";
        postPreviewContainer.style.borderRadius = "10px";
        postPreviewContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
        modalOverlay.style.display = "block";
      } else {
        postPreviewContainer.style.display = "block";
        studioPostLayout.style.display = "flex";
        studioPostContainer.style.width = "49%";
        modalOverlay.style.display = "none";
        postPreviewContainer.style.position = "";
        postPreviewContainer.style.top = "";
        postPreviewContainer.style.left = "";
        postPreviewContainer.style.transform = "";
        postPreviewContainer.style.zIndex = "";
        postPreviewContainer.style.width = "";
        postPreviewContainer.style.borderRadius = "";
        postPreviewContainer.style.boxShadow = "";
      }
    } else {
      postPreviewContainer.style.display = "none";
      studioPostContainer.style.width = "100%";
    }

    return () => {
      if (closeElement) {
        closeElement.remove();
      }
    };
  }, [isOpenPreview, isMobile]);

  return (
    <div style={{ marginTop: "90px" }}>
      {/* Class applied from main title of SChoolChannelStudio.scss */}
      <h1 className="studio-function-title">Tuỳ chỉnh bài viết của bạn</h1>
      <div className="studio-post-layout" id="studio-post-layout">
        <div className="studio-post-container" id="studio-post-container">
          <div className="studio-post-content">
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              onValuesChange={handleFormChange}
            >
              <Form.Item
                label={<h2 className="studio-post-des">Tiêu đề</h2>}
                name="Title"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tiêu đề bài viết!",
                  },
                  { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự!" },
                  { max: 50, message: "Tiêu đề không được quá 50 ký tự!" },
                ]}
              >
                <Input
                  className="studio-post-input"
                  placeholder="Nhập tiêu đề bài viết"
                />
              </Form.Item>

              <Form.Item
                label={<h2 className="studio-post-des">Nội dung</h2>}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhâp nội dung bài viết!",
                  },
                ]}
              >
                <div style={{ border: "1px solid #777", borderRadius: 5 }}>
                  <MDXEditor
                    markdown=""
                    onChange={handleChangeFormatText}
                    plugins={[
                      toolbarPlugin({
                        toolbarClassName: "editor-toolbar",
                        toolbarContents: () => (
                          <>
                            {" "}
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <BlockTypeSelect />
                            <ListsToggle />
                            <CreateLink />
                            <InsertThematicBreak />
                            <CodeToggle />
                            <DiffSourceToggleWrapper />
                          </>
                        ),
                      }),
                      headingsPlugin(),
                      listsPlugin(),
                      thematicBreakPlugin(),
                      diffSourcePlugin({
                        readOnlyDiff: true
                      }),
                    ]}
                  />
                </div>
              </Form.Item>

              <Form.Item
                label={<h2 className="studio-post-des">Hình ảnh</h2>}
                name="ImageFiles"
              >
                <Dragger
                  className="studio-post-dragger"
                  beforeUpload={handleBeforeUpload}
                  onChange={handleChangeImage}
                >
                  <p className="ant-upload-drag-icon">
                    <FaImage style={{ fontSize: 50 }} />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả hoặc click để tải ảnh lên
                  </p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên một tệp hoặc hàng loạt. Nghiêm cấm tải các
                    tệp vi phạm bản quyền hoặc không phù hợp.
                  </p>
                </Dragger>
              </Form.Item>

              <Form.Item
                label={<h2 className="studio-post-des">Trạng thái hiển thị</h2>}
                name="FollowerMode"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái hiển thị!",
                  },
                ]}
              >
                <Flex justify="space-between">
                  <div
                    onClick={() => getStatus(false)}
                    className={`studio-post-status ${
                      postStatus === false ? "studio-post-status__active" : ""
                    }`}
                  >
                    <p>
                      <FaEarthAmericas />
                    </p>
                    <p style={{ fontWeight: "bold" }}>Công khai</p>
                    <p>Mọi người có thể xem</p>
                  </div>

                  <div
                    onClick={() => getStatus(true)}
                    className={`studio-post-status ${
                      postStatus ? "studio-post-status__active" : ""
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

              <Flex align="center">
                <Button className="studio-post-button" htmlType="submit">
                  Đăng
                </Button>

                <Switch
                  className="preview-switch"
                  checkedChildren="Đang mở"
                  unCheckedChildren="Xem trước"
                  onChange={onChangePreviewPost}
                  id="preview-switch"
                  checked={isOpenPreview}
                />
              </Flex>
            </Form>
          </div>
        </div>
        <StudioPostPreview previewPostData={previewPostData} />
        <div id="modal-overlay" className="modal-overlay"></div>
      </div>
    </div>
  );
}

export default StudioPost;
