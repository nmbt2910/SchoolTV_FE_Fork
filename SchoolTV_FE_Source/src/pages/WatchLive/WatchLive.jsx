import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './WatchLive.css';

const WatchLive = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastVolume, setLastVolume] = useState(100);
  const [activeTab, setActiveTab] = useState('live');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  const playerRef = useRef(null);
  const chatMessagesRef = useRef(null);

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
  }, []);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.playVideo();
    startProgressBarUpdate();
  };

  const startProgressBarUpdate = () => {
    setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        setProgress((currentTime / duration) * 100);
      }
    }, 1000);
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      if (newVolume === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(newVolume);
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(lastVolume);
        setVolume(lastVolume);
      } else {
        setLastVolume(volume);
        playerRef.current.mute();
        setVolume(0);
      }
      setIsMuted(!isMuted);
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
    <div className="main-container">
      <div className="content-section">
        <section className="stream-section">
          <div className="video-container">
            <YouTube
              videoId="vHOv3sJWkUs"
              opts={{
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  enablejsapi: 1,
                }
              }}
              onReady={onPlayerReady}
              className="youtube-player"
            />
            <div className="video-controls">
              <button className="control-button" onClick={togglePlay}>
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
              </button>

              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }} />
              </div>

              <div className="volume-control">
                <button className="control-button" onClick={toggleMute}>
                  <i className={`fas ${isMuted || volume === 0
                      ? 'fa-volume-mute'
                      : volume < 50
                        ? 'fa-volume-down'
                        : 'fa-volume-up'
                    }`} />
                </button>
                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{
                    background: `linear-gradient(to right, var(--primary-color) ${volume}%, rgba(255, 255, 255, 0.3) ${volume}%)`
                  }}
                />
              </div>

              <button
                className="control-button"
                onClick={() => {
                  const iframe = document.querySelector('.youtube-player');
                  if (iframe) {
                    if (iframe.requestFullscreen) {
                      iframe.requestFullscreen();
                    } else if (iframe.webkitRequestFullscreen) {
                      iframe.webkitRequestFullscreen();
                    }
                  }
                }}
              >
                <i className="fas fa-expand" />
              </button>
            </div>
          </div>

          <div className="stream-info">
            <div className="stream-header">
              <h1 className="stream-title">
                Lễ Tốt Nghiệp 2023 - ĐH Bách Khoa Hà Nội
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
              <p>Buổi lễ tốt nghiệp trang trọng dành cho các tân kỹ sư, cử nhân Đại học Bách Khoa Hà Nội. Chương trình bao gồm các phần:</p>
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>Phát biểu của Ban Giám hiệu</li>
                <li>Trao bằng tốt nghiệp</li>
                <li>Vinh danh sinh viên xuất sắc</li>
                <li>Các tiết mục văn nghệ đặc sắc</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="suggested-content">
          <div className="content-tabs">
            <button
              className={`content-tab ${activeTab === 'live' ? 'active' : ''}`}
              onClick={() => setActiveTab('live')}
            >
              Đang Live
            </button>
            <button
              className={`content-tab ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              Video Gợi Ý
            </button>
            <button
              className={`content-tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Bài Viết
            </button>
          </div>

          <div className={`tab-content ${activeTab === 'live' ? 'active' : ''}`}>
            <div className="content-card" data-aos="fade-up">
              <div className="content-thumbnail">
                <img src="https://picsum.photos/200/120?random=1" alt="Live thumbnail" />
                <div className="live-indicator">
                  <span className="pulse"></span> LIVE
                </div>
              </div>
              <div className="content-info">
                <h3 className="content-title">Hội thảo: Công nghệ AI trong Giáo dục</h3>
                <div className="content-meta">
                  <span>ĐH FPT</span>
                  <span><i className="fas fa-users" /> 856 người xem</span>
                </div>
              </div>
            </div>

            <div className="content-card" data-aos="fade-up" data-aos-delay="100">
              <div className="content-thumbnail">
                <img src="https://picsum.photos/200/120?random=2" alt="Live thumbnail" />
                <div className="live-indicator">
                  <span className="pulse"></span> LIVE
                </div>
              </div>
              <div className="content-info">
                <h3 className="content-title">Workshop: Digital Marketing Trends 2024</h3>
                <div className="content-meta">
                  <span>ĐH Ngoại thương</span>
                  <span><i className="fas fa-users" /> 445 người xem</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'videos' ? 'active' : ''}`}>
            <div className="content-card" data-aos="fade-up">
              <div className="content-thumbnail">
                <img src="https://picsum.photos/200/120?random=3" alt="Video thumbnail" />
                <span className="duration">15:24</span>
              </div>
              <div className="content-info">
                <h3 className="content-title">Top 10 Lý Do Chọn ĐH Bách Khoa</h3>
                <div className="content-meta">
                  <span>ĐH Bách Khoa Hà Nội</span>
                  <span><i className="fas fa-eye" /> 12K lượt xem</span>
                </div>
              </div>
            </div>

            <div className="content-card" data-aos="fade-up" data-aos-delay="100">
              <div className="content-thumbnail">
                <img src="https://picsum.photos/200/120?random=4" alt="Video thumbnail" />
                <span className="duration">22:15</span>
              </div>
              <div className="content-info">
                <h3 className="content-title">Một Ngày Của Sinh Viên Y Khoa</h3>
                <div className="content-meta">
                  <span>ĐH Y Hà Nội</span>
                  <span><i className="fas fa-eye" /> 8.5K lượt xem</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'posts' ? 'active' : ''}`}>
            <div className="content-card" data-aos="fade-up">
              <div className="content-info">
                <h3 className="content-title">
                  🎉 Chúc mừng đội tuyển sinh viên FTU đã đạt giải Nhất cuộc thi "Marketing Challenge 2023"!
                </h3>
                <div className="content-meta">
                  <span>ĐH Ngoại thương</span>
                  <span><i className="far fa-clock" /> 2 giờ trước</span>
                </div>
              </div>
            </div>

            <div className="content-card" data-aos="fade-up" data-aos-delay="100">
              <div className="content-info">
                <h3 className="content-title">📢 Thông báo tuyển sinh năm học 2024-2025</h3>
                <div className="content-meta">
                  <span>ĐH Bách Khoa Hà Nội</span>
                  <span><i className="far fa-clock" /> 3 giờ trước</span>
                </div>
              </div>
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