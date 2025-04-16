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
  const playerRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const isToday = currentDate.isSame(dayjs(), "day");
  const displayDate = currentDate.format("DD/MM/YYYY");

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
  }, [logicDate, channelId]); // Added channelId as dependency

  const mockUsers = [
    { name: 'Minh Anh', badge: 'Mod' },
    { name: 'Hoàng Long', badge: 'VIP' },
    { name: 'Thu Hà', badge: null },
    { name: 'Đức Nam', badge: 'Admin' }
  ];

  const emojis = ['😊', '👋', '❤️', '👏', '🎓', '🌟', '💪', '🎉', '🙌', '✨'];

  const initialMessages = [
    'Chúc mừng các tân cử nhân! 🎓',
    'Buổi lễ thật trang trọng và ý nghĩa 👏',
    'Chúc các bạn thành công trên con đường sắp tới 🌟',
    'Cảm động quá! 😊'
  ];

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true
    });

    initialMessages.forEach((text, index) => {
      setTimeout(() => {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        addMessage(text, randomUser);
      }, index * 1000);
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
        onClick={() => setDisplayIframeUrl(schedule.iframeUrl)}
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
      const response = await apiFetch(
        `Schedule/by-channel-and-date?channelId=${channelId}&date=${encodeURIComponent(date)}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Không thể lấy lịch phát sóng!");

      const data = await response.json();

      if (data?.data?.$values) {
        // Filter and map only live schedules
        const schedules = data.data.$values
          .filter(schedule => schedule.status === "Live") // Only get live schedules
          .map((schedule) => ({
            startTime: dayjs(schedule.startTime),
            endTime: dayjs(schedule.endTime),
            programName: schedule.program.programName,
            status: true, // Since we're only getting live ones
            iframeUrl: schedule.iframeUrl,
            isReplay: schedule.isReplay,
          }))
          .sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());

        setDisplaySchedule(schedules);

        // Set the iframe URL to the first live stream if available
        if (schedules.length > 0) {
          setDisplayIframeUrl(schedules[0].iframeUrl);
        } else {
          // If no live streams, clear the iframe URL
          setDisplayIframeUrl("");
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy lịch phát sóng!");
      console.error("Error fetching schedule program:", error);
    }
  };

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
      text,
      user,
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      addMessage(messageInput, { name: 'Bạn', badge: null });
      setMessageInput('');
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
            <div className={`schedule-overlay ${showSchedule ? 'visible' : ''}`}
              onClick={() => setShowSchedule(false)}
            />
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
              <h1 className="stream-title">
                {displaySchedule.find(s => s.iframeUrl === displayIframeUrl)?.programName || "Chương trình đang phát sóng"}
              </h1>
              <div className="live-badge">LIVE</div>
            </div>

            <div className="stream-meta">
              <span><i className="fas fa-users" /> 1,234 người xem</span>
              <span><i className="fas fa-clock" /> Bắt đầu 2 giờ trước</span>
              <span><i className="fas fa-university" /> ĐH Bách Khoa Hà Nội</span>
              <span><i className="fas fa-heart" /> 2.5K lượt thích</span>
            </div>

            <div className="stream-actions">
              <button className="action-button primary-action">
                <i className="fas fa-heart" /> Thích
              </button>
              <button className="action-button secondary-action">
                <i className="fas fa-share" /> Chia sẻ
              </button>
              <button className="action-button secondary-action">
                <i className="fas fa-bell" /> Theo dõi
              </button>
            </div>

            <div className="stream-description">
              <p>Nội dung chương trình sẽ được cập nhật sớm nhất.</p>
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
          {messages.map((message, index) => (
            <div className="message" key={index}>
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
          ))}
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