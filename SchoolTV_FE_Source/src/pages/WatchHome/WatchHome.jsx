import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import './WatchHome.css';

export default function WatchHome() {

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
        <div className="streams-grid">
          <Link to="/watchLive">
            <div className="stream-card" style={{ cursor: 'pointer' }}>
              <div className="stream-thumbnail">
                <img
                  src="https://th.bing.com/th/id/R.8e4e66e9f40181fe438820b72c858c1f?rik=iUnxzImnEcS3Mw&riu=http%3a%2f%2fwww.rich-group.com.cn%2fupload%2fimage%2f20200909%2f20200909170711431143.JPG&ehk=1AmN2abj2b%2b%2ff2JCt8B1wqgcwHnFmr4%2bQz23yX%2fwetI%3d&risl=&pid=ImgRaw&r=0"
                  alt="Stream thumbnail"
                />
                <div className="live-badge">LIVE</div>
              </div>
              <div className="stream-info">
                <h3 className="stream-title">Hội Thảo Công Nghệ AI 2023</h3>
                <div className="stream-meta">
                  <span>ĐH Bách Khoa</span>
                  <span>
                    <i className="fas fa-users" /> 1.2K người xem
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/watchLive">
            <div className="stream-card" style={{ cursor: 'pointer' }}>
              <div className="stream-thumbnail">
                <img
                  src="https://cdn.tuoitre.vn/471584752817336320/2024/5/12/dsc8344-17154910796401821942426.jpg"
                  alt="Stream thumbnail"
                />
                <div className="live-badge">LIVE</div>
              </div>
              <div className="stream-info">
                <h3 className="stream-title">Talkshow: Khởi Nghiệp</h3>
                <div className="stream-meta">
                  <span>ĐH Kinh Tế</span>
                  <span>
                    <i className="fas fa-users" /> 856 người xem
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/watchLive">
            <div className="stream-card" style={{ cursor: 'pointer' }}>
              <div className="stream-thumbnail">
                <img
                  src="https://vov2.vov.vn/sites/default/files/styles/large/public/2021-01/FPT-hoa-lac-VTN-greenmore6.jpg"
                  alt="Stream thumbnail"
                />
                <div className="live-badge">LIVE</div>
              </div>
              <div className="stream-info">
                <h3 className="stream-title">Workshop: Digital Marketing</h3>
                <div className="stream-meta">
                  <span>ĐH FPT</span>
                  <span>
                    <i className="fas fa-users" /> 623 người xem
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Sắp Diễn Ra</h2>
          <a href="#" className="see-all">
            Xem tất cả <i className="fas fa-arrow-right" />
          </a>
        </div>
        <div className="events-grid">
          <div className="event-card" data-aos="fade-up">
            <div className="event-date">
              <i className="far fa-calendar" /> 25/12/2023 - 14:00
            </div>
            <h3 className="event-title">Lễ Trao Bằng Tốt Nghiệp</h3>
            <p>ĐH Quốc Gia Hà Nội</p>
            <div className="event-meta">
              <span>
                <i className="fas fa-map-marker-alt" /> Hội trường A1
              </span>
              <span>
                <i className="fas fa-users" /> 2000 người tham gia
              </span>
            </div>
            <button className="reminder-btn">
              <i className="far fa-bell" /> Đặt Lịch Nhắc
            </button>
          </div>
          <div className="event-card" data-aos="fade-up" data-aos-delay={100}>
            <div className="event-date">
              <i className="far fa-calendar" /> 27/12/2023 - 09:00
            </div>
            <h3 className="event-title">Hội Thảo: Trí Tuệ Nhân Tạo</h3>
            <p>ĐH Bách Khoa Hà Nội</p>
            <div className="event-meta">
              <span>
                <i className="fas fa-map-marker-alt" /> Phòng Hội Thảo B3
              </span>
              <span>
                <i className="fas fa-users" /> 500 người tham gia
              </span>
            </div>
            <button className="reminder-btn">
              <i className="far fa-bell" /> Đặt Lịch Nhắc
            </button>
          </div>
          <div className="event-card" data-aos="fade-up" data-aos-delay={200}>
            <div className="event-date">
              <i className="far fa-calendar" /> 28/12/2023 - 15:30
            </div>
            <h3 className="event-title">Workshop: Digital Marketing</h3>
            <p>ĐH Ngoại Thương</p>
            <div className="event-meta">
              <span>
                <i className="fas fa-map-marker-alt" /> Hội trường C2
              </span>
              <span>
                <i className="fas fa-users" /> 300 người tham gia
              </span>
            </div>
            <button className="reminder-btn">
              <i className="far fa-bell" /> Đặt Lịch Nhắc
            </button>
          </div>
          <div className="event-card" data-aos="fade-up" data-aos-delay={300}>
            <div className="event-date">
              <i className="far fa-calendar" /> 30/12/2023 - 08:00
            </div>
            <h3 className="event-title">Ngày Hội Việc Làm 2023</h3>
            <p>ĐH Kinh Tế Quốc Dân</p>
            <div className="event-meta">
              <span>
                <i className="fas fa-map-marker-alt" /> Sân trường
              </span>
              <span>
                <i className="fas fa-users" /> 5000 người tham gia
              </span>
            </div>
            <button className="reminder-btn">
              <i className="far fa-bell" /> Đặt Lịch Nhắc
            </button>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Video Nổi Bật</h2>
          <a href="featured-video" className="see-all">
            Xem tất cả <i className="fas fa-arrow-right" />
          </a>
        </div>

        <div className="videos-grid">
          <div className="video-card" data-aos="fade-up">
            <div className="video-thumbnail">
              <img
                src="https://huongnghiep.hocmai.vn/wp-content/uploads/2022/03/dh-bach-khoa-tphcm.jpeg"
                alt="Video thumbnail"
              />
              <span className="video-duration">15:24</span>
            </div>
            <div className="video-info">
              <div className="video-header">
                <img
                  src="https://vov2.vov.vn/sites/default/files/styles/large/public/2021-01/FPT-hoa-lac-VTN-greenmore6.jpg"
                  alt="University avatar"
                  className="university-avatar"
                />
                <div className="video-meta">
                  <h3 className="video-title">Top 10 Lý Do Chọn ĐH Bách Khoa</h3>
                  <p className="university-name">ĐH Bách Khoa Hà Nội</p>
                </div>
              </div>
              <div className="video-stats">
                <span>
                  <i className="fas fa-eye" /> 12K lượt xem
                </span>
                <span>
                  <i className="far fa-clock" /> 2 ngày trước
                </span>
              </div>
            </div>
          </div>
          <div className="video-card" data-aos="fade-up" data-aos-delay={100}>
            <div className="video-thumbnail">
              <img
                src="https://th.bing.com/th/id/R.24559b8a6c2a76982d878d18cb564a25?rik=2a6LnBf5Dwwjgg&riu=http%3a%2f%2fnganhydakhoa.edu.vn%2fwp-content%2fuploads%2f2020%2f07%2fnganhydakhoa1-kinh-nghiem-cho-bac-si-y-khoa-640x400.jpg&ehk=fdKgbI%2bn0PLNUv3iqc513CXTbQh3i2%2bgpVprVNdNvVE%3d&risl=&pid=ImgRaw&r=0"
                alt="Video thumbnail"
              />
              <span className="video-duration">22:15</span>
            </div>
            <div className="video-info">
              <div className="video-header">
                <img
                  src="https://vov2.vov.vn/sites/default/files/styles/large/public/2021-01/FPT-hoa-lac-VTN-greenmore6.jpg"
                  alt="University avatar"
                  className="university-avatar"
                />
                <div className="video-meta">
                  <h3 className="video-title">Một Ngày Của Sinh Viên Y Khoa</h3>
                  <p className="university-name">ĐH Y Hà Nội</p>
                </div>
              </div>
              <div className="video-stats">
                <span>
                  <i className="fas fa-eye" /> 8.5K lượt xem
                </span>
                <span>
                  <i className="far fa-clock" /> 5 ngày trước
                </span>
              </div>
            </div>
          </div>
          <div className="video-card" data-aos="fade-up" data-aos-delay={200}>
            <div className="video-thumbnail">
              <img
                src="https://th.bing.com/th/id/OIP.z5HSKK9MY4hX2bL06q-3pAHaE8?rs=1&pid=ImgDetMain"
                alt="Video thumbnail"
              />
              <span className="video-duration">18:30</span>
            </div>
            <div className="video-info">
              <div className="video-header">
                <img
                  src="https://vov2.vov.vn/sites/default/files/styles/large/public/2021-01/FPT-hoa-lac-VTN-greenmore6.jpg"
                  alt="University avatar"
                  className="university-avatar"
                />
                <div className="video-meta">
                  <h3 className="video-title">Hướng Dẫn Đăng Ký Học Phần</h3>
                  <p className="university-name">ĐH Kinh Tế Quốc Dân</p>
                </div>
              </div>
              <div className="video-stats">
                <span>
                  <i className="fas fa-eye" /> 15K lượt xem
                </span>
                <span>
                  <i className="far fa-clock" /> 1 tuần trước
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Bài Viết Cộng Đồng</h2>
          <a href="#" className="see-all">
            Xem tất cả <i className="fas fa-arrow-right" />
          </a>
        </div>
        <div className="posts-grid">
          <div className="post-card" data-aos="fade-up">
            <div className="post-header">
              <img
                src="https://loremflickr.com/320/240?random=2"
                alt="University avatar"
                className="university-avatar"
              />
              <div className="post-meta">
                <h3 className="university-name">ĐH Ngoại Thương</h3>
                <span className="post-time">2 giờ trước</span>
              </div>
            </div>
            <div className="post-content">
              <p>
                🎉 Chúc mừng đội tuyển sinh viên FTU đã đạt giải Nhất cuộc thi
                "Marketing Challenge 2023"! Tự hào về các bạn! 🏆
              </p>
              <img
                src="https://loremflickr.com/320/240?random=2"
                alt="Post image"
              />
              <div className="post-actions">
                <button>
                  <i className="far fa-heart" /> 1.2K
                </button>
                <button>
                  <i className="far fa-comment" /> 85
                </button>
                <button>
                  <i className="far fa-share-square" /> Chia sẻ
                </button>
              </div>
            </div>
          </div>
          <div className="post-card" data-aos="fade-up" data-aos-delay={200}>
            <div className="post-header">
              <img
                src="https://loremflickr.com/320/240?random=2"
                alt="University avatar"
                className="university-avatar"
              />
              <div className="post-meta">
                <h3 className="university-name">ĐH Bách Khoa Hà Nội</h3>
                <span className="post-time">5 giờ trước</span>
              </div>
            </div>
            <div className="post-content">
              <p>
                📢 Thông báo quan trọng: Đã mở đăng ký học kỳ 2 năm học 2023-2024.
                Sinh viên vui lòng truy cập cổng thông tin để đăng ký!
              </p>
              <img
                src="https://loremflickr.com/320/240?random=2"
                alt="Post image"
              />
              <div className="post-actions">
                <button>
                  <i className="far fa-heart" /> 856
                </button>
                <button>
                  <i className="far fa-comment" /> 123
                </button>
                <button>
                  <i className="far fa-share-square" /> Chia sẻ
                </button>
              </div>
            </div>
          </div>
          <div className="post-card" data-aos="fade-up" data-aos-delay={200}>
            <div className="post-header">
              <img
                src="https://loremflickr.com/320/240?random=2"
                alt="University avatar"
                className="university-avatar"
              />
              <div className="post-meta">
                <h3 className="university-name">ĐH FPT</h3>
                <span className="post-time">8 giờ trước</span>
              </div>
            </div>
            <div className="post-content">
              <p>
                🌟 Chương trình trao đổi sinh viên với các trường đại học Nhật Bản
                đã chính thức mở đơn!
              </p>
              <img
                src="https://loremflickr.com/320/240?random=2"
                alt="Post image"
              />
              <div className="post-actions">
                <button>
                  <i className="far fa-heart" /> 645
                </button>
                <button>
                  <i className="far fa-comment" /> 78
                </button>
                <button>
                  <i className="far fa-share-square" /> Chia sẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>

  );
}