import React, { useState, useEffect, useRef, useContext } from 'react';
import YouTube from 'react-youtube';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './WatchLive.css';
import { ThemeContext } from '../../context/ThemeContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiFetch from '../../config/baseAPI';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import VideoComment from '../watch-program/VideoComment';
import { Timeline } from 'antd';

dayjs.extend(utc);
dayjs.extend(timezone);

const WatchLive = () => {
  const { theme } = useContext(ThemeContext);
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [logicDate, setLogicDate] = useState(currentDate.format("YYYY-MM-DD") || "");
  const [displaySchedule, setDisplaySchedule] = useState([]);
  const [displayIframeUrl, setDisplayIframeUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoHistoryId, setVideoHistoryId] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const playerRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const isToday = currentDate.isSame(dayjs(), "day");
  const displayDate = currentDate.format("DD/MM/YYYY");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  useEffect(() => {
    const chatContainer = chatMessagesRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50; // 50px threshold
      setIsUserScrolledUp(!isNearBottom);
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!channelId) {
      toast.error("Không tìm thấy kênh!");
      navigate('/');
      return;
    }
  }, [channelId]);

  useEffect(() => {
    // Initial fetch
    fetchScheduleProgram(logicDate);

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchScheduleProgram(logicDate);
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [logicDate, channelId]);

  useEffect(() => {
    // Fetch comments when videoHistoryId changes
    if (videoHistoryId) {
      fetchComments();
      // Set up interval to fetch comments every 5 seconds
      const commentInterval = setInterval(fetchComments, 5000);
      return () => clearInterval(commentInterval);
    }
  }, [videoHistoryId]);

  const fetchComments = async () => {
    try {
      if (isInitialLoad) {
        setIsLoadingComments(true);
      }
  
      setCommentError(null);
      const response = await apiFetch(`Comment/video/${videoHistoryId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Accept": "application/json"
        }
      });
  
      if (!response.ok) throw new Error("Không thể tải bình luận!");
  
      const data = await response.json();
      if (data?.$values) {
        const formattedComments = data.$values.map(comment => ({
          id: comment.commentID,
          text: comment.content,
          user: {
            name: "Người xem",
            badge: null
          },
          // Explicitly parse UTC and convert to GMT+7
          time: dayjs.utc(comment.createdAt).tz("Asia/Bangkok").format('HH:mm')
        }));
  
        setMessages(formattedComments);
  
        setTimeout(() => {
          if (!isUserScrolledUp && chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
          }
        }, 0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentError("Có lỗi đã xảy ra. Vui lòng thử lại sau.");
    } finally {
      if (isInitialLoad) {
        setIsInitialLoad(false);
        setIsLoadingComments(false);
      }
    }
  };

  useEffect(() => {
    if (videoHistoryId) {
      setIsInitialLoad(true); // Reset loading state for new video
      fetchComments();
    }
  }, [videoHistoryId]);

  const postComment = async (content) => {
    try {
      const response = await apiFetch(`Comment`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          content: content,
          videoHistoryID: videoHistoryId
        })
      });

      if (!response.ok) throw new Error("Không thể đăng bình luận!");

      // After posting, fetch latest comments
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Không thể đăng bình luận. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true
    });

    handleExistChannel();
  }, []);

  useEffect(() => {
    const newLogicDate = currentDate.format("YYYY-MM-DD");
    setLogicDate(newLogicDate);
    fetchScheduleProgram(newLogicDate);
  }, [currentDate]);

  const handlePrevDay = () => {
    setCurrentDate(prev => prev.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setCurrentDate(prev => prev.add(1, "day"));
  };

  const programList = displaySchedule.map((schedule) => ({
    color: "#FF4757", // Always red since all are live
    children: (
      <div
        className="schedule-item live"
        onClick={() => {
          setDisplayIframeUrl(schedule.iframeUrl);
          setVideoHistoryId(schedule.videoHistoryIdFromSchedule);
        }}
      >
        <div className="schedule-time">
          <div className="time-indicator live" />
          {schedule.startTime.format("HH:mm")}
        </div>
        <div className="schedule-info">
          <div className="schedule-name">{schedule.programName}</div>
          <div className="schedule-description">
            <span className="live-status">Đang phát sóng</span>
          </div>
        </div>
      </div>
    ),
  }));

  const fetchScheduleProgram = async (date) => {
    try {
      console.log('Fetching schedule for date:', date); // Debug log
      const response = await apiFetch(
        `Schedule/by-channel-and-date?channelId=${channelId}&date=${encodeURIComponent(date)}`,
        { method: "GET" }
      );

      console.log('API response:', response); // Debug log

      if (!response.ok) throw new Error("Không thể lấy lịch phát sóng!");

      const data = await response.json();
      console.log('API data:', data); // Debug log

      if (data?.data?.$values) {
        // Filter and map only live schedules
        const schedules = data.data.$values
          .filter(schedule => schedule.status === "Live")
          .map((schedule) => ({
            startTime: dayjs(schedule.startTime),
            endTime: dayjs(schedule.endTime),
            programName: schedule.program.programName,
            status: true,
            iframeUrl: schedule.iframeUrl,
            isReplay: schedule.isReplay,
            videoHistoryIdFromSchedule: schedule.videoHistoryIdFromSchedule
          }))
          .sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());

        console.log('Processed schedules:', schedules); // Debug log

        setDisplaySchedule(schedules);

        if (schedules.length > 0) {
          console.log('Setting iframeUrl and videoHistoryId:', schedules[0].iframeUrl, schedules[0].videoHistoryIdFromSchedule); // Debug log
          setDisplayIframeUrl(schedules[0].iframeUrl);
          setVideoHistoryId(schedules[0].videoHistoryIdFromSchedule); // This should set videoHistoryId to 1025
        } else {
          setDisplayIframeUrl("");
          setVideoHistoryId(null);
        }
      }
    } catch (error) {
      console.error("Error fetching schedule program:", error);
      toast.error("Có lỗi xảy ra khi lấy lịch phát sóng!");
    }
  };

  useEffect(() => {
    console.log('videoHistoryId updated:', videoHistoryId);
  }, [videoHistoryId]);

  const handleExistChannel = async () => {
    if (!channelId) {
      toast.error("ID kênh không hợp lệ!");
      navigate("/channelList");
      return;
    }

    try {
      const response = await apiFetch(`schoolchannels/${channelId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Kênh không tồn tại!");
      }

      const data = await response.json();
      if (!data) {
        throw new Error("Không có dữ liệu kênh!");
      }

      fetchScheduleProgram(logicDate);
    } catch (error) {
      console.error("Error checking channel:", error);
      toast.error(error.message || "Có lỗi xảy ra khi kiểm tra kênh!");
      navigate("/channelList");
    }
  };

  const addMessage = (text, user) => {
    const newMessage = {
      id: Date.now(),
      text,
      user,
      // Format current time in GMT+7
      time: dayjs().tz("Asia/Bangkok").format('HH:mm')
    };
    setMessages(prev => [...prev, newMessage]);
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      if (videoHistoryId) {
        postComment(messageInput);
      } else {
        addMessage(messageInput, { name: 'Bạn', badge: null });
      }
      setMessageInput('');

      // Force scroll to bottom on send (regardless of user scroll)
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 0);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="main-container" style={{ background: 'var(--bg-color)' }}>
      <div className="content-section">
        <section className="stream-section">
          <div className="video-container">
            {showSchedule && (
              <div className="schedule-overlay visible"
                onClick={() => setShowSchedule(false)}
              />
            )}
            {displayIframeUrl ? (
              <>
                <button
                  className="schedule-button"
                  onClick={() => setShowSchedule(!showSchedule)}
                >
                  <i className="fas fa-calendar-alt" /> Lịch chiếu
                </button>
                <iframe
                  src={displayIframeUrl}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="youtube-player"
                />
              </>
            ) : (
              <div className="no-video-placeholder">
                <i className="fas fa-tv fa-3x" />
                <p>Không có chương trình nào đang phát sóng</p>
              </div>
            )}
            {showSchedule && (
              <div className="schedule-panel visible">
                <div className="schedule-header">
                  <h3 className="schedule-title">
                    <i className="fas fa-calendar-alt" /> Lịch phát sóng
                  </h3>
                  <button
                    className="schedule-close"
                    onClick={() => setShowSchedule(false)}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>

                <div className="schedule-nav">
                  <div className="schedule-date">
                    <i className="fas fa-calendar" />
                    {isToday && "Hôm nay - "}
                    {displayDate}
                  </div>
                  <div className="schedule-arrows">
                    <button
                      className="schedule-arrow"
                      onClick={handlePrevDay}
                    >
                      <i className="fas fa-chevron-left" />
                    </button>
                    <button
                      className="schedule-arrow"
                      onClick={handleNextDay}
                    >
                      <i className="fas fa-chevron-right" />
                    </button>
                  </div>
                </div>

                <div className="schedule-content">
                  {displaySchedule.length > 0 ? (
                    <Timeline items={programList} />
                  ) : (
                    <div className="no-schedule">Không có lịch phát sóng</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="stream-info">
            <div className="stream-header">
              <div className="stream-title-row">
                <h1 className="stream-title">
                  {displaySchedule.find(s => s.iframeUrl === displayIframeUrl)?.programName || "Chương trình đang phát sóng"}
                </h1>
                <div className="live-badge">LIVE</div>
              </div>

              <div className="stream-actions">
                <button className="action-button primary-action">
                  <i className="fas fa-thumbs-up" /> Thích
                </button>
                <button className="action-button secondary-action">
                  <i className="fas fa-share" /> Chia sẻ
                </button>
                <button className="action-button secondary-action">
                  <i className="fas fa-flag" /> Báo cáo
                </button>
              </div>
            </div>

            <div className="channel-info">
              <div className="channel-avatar">
                <img
                  src="https://picsum.photos/200/200"
                  alt="ĐH Bách Khoa Hà Nội"
                />
              </div>
              <div className="channel-details">
                <div className="channel-name">ĐH Bách Khoa Hà Nội</div>
                <div className="channel-subscribers">
                  1.2K người đăng ký
                </div>
              </div>
              <button className="subscribe-button">
                <i className="fas fa-bell" /> Theo dõi
              </button>
            </div>

            {/* Stream description */}
            <div className="stream-description">
              <h3>Giới thiệu chương trình</h3>
              <p>Nội dung chương trình sẽ được cập nhật sớm nhất. Đây là buổi lễ tốt nghiệp năm 2023 của trường Đại học Bách Khoa Hà Nội.</p>
            </div>
          </div>
        </section>
      </div>

      <aside className="chat-section">
        <div className="chat-header">
          <h2 className="chat-title">
            <i className="fas fa-comments" /> Trò chuyện trực tiếp
          </h2>
          <div className="chat-options">
            <button className="chat-option" title="Cài đặt chat">
              <i className="fas fa-cog" />
            </button>
            <button className="chat-option" title="Mở rộng">
              <i className="fas fa-expand" />
            </button>
          </div>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          {commentError ? (
            <div className="message">
              <div className="message-content">{commentError}</div>
            </div>
          ) : messages.length === 0 ? (
            isInitialLoad ? (
              <div className="message">
                <div className="message-content">Đang tải bình luận...</div>
              </div>
            ) : (
              <div className="message">
                <div className="message-content">Chưa có bình luận nào.</div>
              </div>
            )
          ) : (
            messages.map((message) => (
              <div className="message" key={message.id}>
                <div className="message-header">
                  <span className="username">
                    {message.user.name}
                    {message.user.badge && (
                      <span className="user-badge">{message.user.badge}</span>
                    )}
                  </span>
                  <span className="message-time">{message.time}</span>
                </div>
                <div className="message-content">{message.text}</div>
              </div>
            ))
          )}
        </div>

        <div className="chat-input">
          <div className="input-container">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="emoji-trigger chat-option"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <i className="far fa-smile" />
            </button>

            {showEmojiPicker && (
              <div className="emoji-picker">
                <div className="emoji-grid">
                  {emojis.map((emoji, index) => (
                    <div
                      key={index}
                      className="emoji-item"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={!messageInput.trim()}
            >
              <i className="fas fa-paper-plane" /> Gửi
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default WatchLive;