import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './WatchHome.css';
import apiFetch from "../../config/baseAPI";

export default function WatchHome() {
  const [liveSchedules, setLiveSchedules] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [videoHistory, setVideoHistory] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveSchedules = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await apiFetch("Schedule/live-now", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch live schedules");

        const data = await response.json();
        setLiveSchedules(data.$values || []);
      } catch (error) {
        console.error("Error fetching live schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSchedules();
  }, []);

  const convertToGMT7 = (dateString) => {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    return new Date(date.getTime() + 7 * 60 * 60 * 1000);
  };

  // Định dạng ngày giờ
  const formatDateTime = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = endTime - startTime;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    // Fetch live schedules
    const fetchLiveSchedules = async () => {
      try {
        const response = await apiFetch("Schedule/live-now", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Accept": "application/json"
          }
        });
        if (response.ok) {
          const data = await response.json();
          setLiveSchedules(data.$values || []);
        }
      } catch (error) {
        console.error("Error fetching live schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch upcoming schedules
    const fetchUpcomingSchedules = async () => {
      try {
        const response = await apiFetch("Schedule/timeline", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Accept": "application/json"
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUpcomingSchedules(data.data.Upcoming.$values || []);
        }
      } catch (error) {
        console.error("Error fetching upcoming schedules:", error);
      } finally {
        setUpcomingLoading(false);
      }
    };

    fetchLiveSchedules();
    fetchUpcomingSchedules();
  }, []);

  useEffect(() => {
    const fetchVideoHistory = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await apiFetch("VideoHistory/active", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch video history");

        const data = await response.json();
        setVideoHistory(data.$values.slice(0, 6) || []);
      } catch (error) {
        console.error("Error fetching video history:", error);
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideoHistory();
  }, []);

  // Hàm chuyển đổi thời gian đã có trong component
  const getTimeAgo = (dateString) => {
    const updatedAt = convertToGMT7(dateString);
    const now = new Date();
    const diff = now - updatedAt;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    return `${minutes} phút trước`;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await apiFetch("News/combined", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setPosts(data.$values || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>School TV | Khám Phá Thế Giới Đại Học</title>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css"
      />
      <section className="banner-section">
        <div className="swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img
                src="https://th.bing.com/th/id/R.69d5030039448756d2f42e492eed6f69?rik=pb%2bcPexDVO8m9w&pid=ImgRaw&r=0"
                alt="Banner 1"
                className="banner-image"
              />
              <div className="banner-content">
                <h2>Lễ Tốt Nghiệp 2023 - ĐH Bách Khoa Hà Nội</h2>
                <p>Trực tiếp từ Nhà hát lớn Hà Nội</p>
              </div>
            </div>
            <div className="swiper-slide">
              <img
                src="https://vov2.vov.vn/sites/default/files/styles/large/public/2021-01/FPT-hoa-lac-VTN-greenmore6.jpg"
                alt="Banner 2"
                className="banner-image"
              />
              <div className="banner-content">
                <h2>Hội Thảo Khoa Học Công Nghệ</h2>
                <p>ĐH Quốc Gia Hà Nội</p>
              </div>
            </div>
            <div className="swiper-slide">
              <img
                src="https://vov2.vov.vn/sites/default/files/styles/large/public/2021-01/FPT-hoa-lac-VTN-greenmore6.jpg"
                alt="Banner 3"
                className="banner-image"
              />
              <div className="banner-content">
                <h2>Festival Sinh Viên 2023</h2>
                <p>Sự kiện văn hóa lớn nhất năm</p>
              </div>
            </div>
          </div>
          <div className="swiper-pagination" />
          <div className="swiper-button-next" />
          <div className="swiper-button-prev" />
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Đang Phát Sóng</h2>
          <Link to="/liveList" className="see-all">
            Xem tất cả <i className="fas fa-arrow-right" />
          </Link>
        </div>

        {loading ? (
          <div className="loading-placeholder">Đang tải...</div>
        ) : liveSchedules.length > 0 ? (
          <div className="streams-grid horizontal-scroll">
            {liveSchedules.slice(0, 5).map((schedule) => (
              <Link to="/watchLive" key={schedule.scheduleID}>
                <div className="stream-card">
                  <div className="stream-thumbnail">
                    <img
                      src={`https://picsum.photos/seed/${schedule.scheduleID}/300/180`}
                      alt="Stream thumbnail"
                    />
                    <div className="live-badge-home">LIVE</div>
                  </div>
                  <div className="stream-info">
                    <h3 className="stream-title">{schedule.programName}</h3>
                    <div className="stream-meta">
                      <span>{schedule.schoolChannelName}</span>
                      <span>
                        <i className="fas fa-clock" />{" "}
                        {calculateDuration(schedule.startTime, schedule.endTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-live-container">
            <div className="no-live-content">
              <i className="fas fa-satellite-dish fa-3x" />
              <p>Không có chương trình trực tiếp nào đang hoạt động.</p>
            </div>
          </div>
        )}
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Sắp Diễn Ra</h2>
          <Link to="/LiveList" className="see-all">
            Xem tất cả <i className="fas fa-arrow-right" />
          </Link>
        </div>

        {upcomingLoading ? (
          <div className="loading-placeholder">Đang tải...</div>
        ) : upcomingSchedules.length > 0 ? (
          <div className="events-grid">
            {upcomingSchedules.map((schedule) => {
              const startTime = convertToGMT7(schedule.startTime);
              const endTime = convertToGMT7(schedule.endTime);

              return (
                <div className="event-card" data-aos="fade-up" key={schedule.scheduleID}>
                  <div className="event-date">
                    <i className="far fa-calendar" />
                    {formatDateTime(startTime)}
                  </div>
                  <h3 className="event-title">
                    <div className="title-text">
                      {schedule.program.programName}
                    </div>
                  </h3>
                  <p>
                    {schedule.program.schoolChannel?.name || "Trường không xác định"}
                  </p>
                  <div className="event-meta">
                    <span>
                      <i className="fas fa-clock" />
                      {` ${Math.floor((endTime - startTime) / 3600000)}h 
          ${Math.floor(((endTime - startTime) % 3600000) / 60000)}m`}
                    </span>
                  </div>
                  <Link to={`/program/${schedule.program.programID}`}>
                    <button className="reminder-btn">
                      <i className="fas fa-info-circle" /> Xem Chi Tiết
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-live-container">
            <div className="no-live-content">
              <i className="fas fa-calendar-times fa-3x" />
              <p>Không có lịch phát sóng nào sắp diễn ra.</p>
            </div>
          </div>
        )}
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Video Lưu Trữ</h2>
          <a href="/archive" className="see-all">
            Xem tất cả <i className="fas fa-arrow-right" />
          </a>
        </div>

        {videoLoading ? (
          <div className="loading-placeholder">Đang tải...</div>
        ) : videoHistory.length > 0 ? (
          <div className="videos-grid horizontal-scroll">
            {videoHistory.map((video) => {
              const updatedAt = convertToGMT7(video.updatedAt);

              return (
                <div className="video-card" key={video.videoHistoryID} data-aos="fade-up">
                  <div className="video-thumbnail">
                    <img
                      src={`https://picsum.photos/seed/${video.videoHistoryID}/300/180`}
                      alt="Video thumbnail"
                    />
                  </div>
                  <div className="video-info">
                    <div className="video-header">
                      <h3 className="video-title">
                        {video.program.programName}
                      </h3>
                      <div className="video-meta">
                        <div className="channel-info">
                          <img
                            src={`https://picsum.photos/seed/${video.videoHistoryID}/100/100`}
                            alt="University avatar"
                            className="university-avatar"
                          />
                          <span className="university-name">
                            {video.program.schoolChannel?.name || "Trường không xác định"}
                          </span>
                        </div>
                        <div className="video-time">
                          <i className="far fa-clock" />
                          {formatDateTime(updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              );
            })}
          </div>
        ) : (
          <div className="no-live-container">
            <div className="no-live-content">
              <i className="fas fa-video-slash fa-3x" />
              <p>Không có Video Lưu Trữ nào.</p>
            </div>
          </div>
        )}
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Bài Viết Cộng Đồng</h2>
          <Link to="/communityPost" className="see-all">
            Xem tất cả <i className="fas fa-arrow-right" />
          </Link>
        </div>

        {postsLoading ? (
          <div className="loading-placeholder">Đang tải...</div>
        ) : posts.length > 0 ? (
          <div className="posts-grid">
            {posts.slice(0, 3).map((post) => (
              <div className="post-card" key={post.newsID} data-aos="fade-up">
                <div className="post-header">
                  <img
                    src={post.schoolChannel?.logoUrl || `https://picsum.photos/seed/${post.newsID}/32/32`}
                    alt="University avatar"
                    className="university-avatar"
                  />
                  <div className="post-meta">
                    <h3 className="university-name">
                      {post.schoolChannel?.name || "Trường không xác định"}
                    </h3>
                    <span className="post-time">
                      {getTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="post-content">
                  <div className="post-text">
                    <h4 style={{
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.title}
                    </h4>
                    <p>{post.content}</p>
                  </div>
                  {post.newsPictures && post.newsPictures.$values &&
                    post.newsPictures.$values.length > 0 && (
                      <div className="post-image-container">
                        <img
                          src={`data:image/jpeg;base64,${post.newsPictures.$values[0].fileData}`}
                          alt={post.title}
                        />
                      </div>
                    )}
                  <div className="post-actions">
                    <button>
                      <i className="far fa-heart" /> {Math.floor(Math.random() * 1000)}
                    </button>
                    <button>
                      <i className="far fa-comment" /> {Math.floor(Math.random() * 100)}
                    </button>
                    <button>
                      <i className="far fa-share-square" /> Chia sẻ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-live-container">
            <div className="no-live-content">
              <i className="fas fa-newspaper fa-3x" />
              <p>Không có Bài Viết Cộng Đồng nào được tìm thấy.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}