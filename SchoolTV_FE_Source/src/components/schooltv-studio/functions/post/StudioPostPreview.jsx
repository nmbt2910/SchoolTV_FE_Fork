import React from "react";
import "./StudioPostPreview.scss";
import { Avatar, Flex } from "antd";
import { FaUserFriends } from "react-icons/fa";
import { GlobalOutlined } from "@ant-design/icons";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import DOMpurify from "isomorphic-dompurify";

import Markdown from "react-markdown";

const MAX_UNEXPANDED_PREVIEW = 200;
const NEWLINE_WEIGHT = 80;

function StudioPostPreview(props) {
  const { previewPostData } = props;

  const [expanded, setExpanded] = React.useState(false);

  const text = React.useMemo(() => {
    return DOMpurify.sanitize(previewPostData.Content);
  }, [props]);

  const shouldRequireExpand = React.useMemo(() => {
    return text.length > MAX_UNEXPANDED_PREVIEW;
  }, [text]);

  const finalText = React.useMemo(() => {
    if (expanded) return text;

    let i = 0;
    let weight = 0;
    let lastValidIndex = 0;

    while (i < text.length && weight < MAX_UNEXPANDED_PREVIEW) {
      if (text[i] === "\n") {
        weight += NEWLINE_WEIGHT;
      } else {
        weight++;
      }

      if (/[\s\.,;!?)]/.test(text[i])) {
        lastValidIndex = i;
      }

      i++;
    }

    
    const cutIndex = lastValidIndex || i;

    return text.slice(0, cutIndex) + "...";
  }, [text, expanded]);


  return (
    <div className="post-preview-container" id="post-preview-container">
      <div className="post-preview-owner">
        <Avatar
          size={55}
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            previewPostData.owner?.fullname || "User"
          )}&background=random`}
        />
        <div className="post-preview-owner-info">
          <p
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "var(--text-color)",
            }}
          >
            {previewPostData.owner?.fullname}
          </p>
          <Flex align="center">
            <p
              style={{
                marginRight: 5,
                color: "var(--video-interaction-color)",
                fontSize: 12,
              }}
            >
              1 phút trước
            </p>
            {previewPostData?.FollowerMode !== undefined &&
              (previewPostData.FollowerMode ? (
                <FaUserFriends
                  style={{
                    color: "var(--video-interaction-color)",
                    fontSize: 12,
                  }}
                />
              ) : (
                <GlobalOutlined
                  style={{
                    color: "var(--video-interaction-color)",
                    fontSize: 12,
                  }}
                />
              ))}
          </Flex>
        </div>
      </div>

      <div className="post-preview-content">
        <div className="post-preview-title">
          <p>{previewPostData ? previewPostData.Title : ""}</p>
        </div>

        <div
          className={
            "post-preview-description" +
            (shouldRequireExpand ? " post-preview-description-lc-more" : "") +
            (expanded ? " post-preview-description-expanded" : "")
          }
        >
          <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]} remarkPlugins={[remarkGfm]}>
            {finalText}
          </Markdown>
          {shouldRequireExpand && (
            <div
              style={{
                display: "inline-block",
                marginLeft: 4,
              }}
            >
              <a
                href="#!"
                onClick={() => setExpanded((x) => !x)}
                className="post-preview-btn-more"
              >
                {expanded ? "Thu gọn" : "Xem thêm"}
              </a>
            </div>
          )}
        </div>

        <div className="post-preview-images"></div>
      </div>
    </div>
  );
}

export default StudioPostPreview;
