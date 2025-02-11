import React, { useEffect } from "react";
import { Link } from "react-router-dom";

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
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        /* Your existing CSS styles here (excluding header and footer styles) */\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n        }\n\n        :root {\n            --primary-color: #4a90e2;\n            --secondary-color: #f0f4f8;\n            --text-color: #2c3e50;\n            --bg-color: #ffffff;\n            --card-bg: rgba(255, 255, 255, 0.95);\n            --shadow-color: rgba(0, 0, 0, 0.1);\n            --hover-color: #357abd;\n            --border-color: #e1e8ed;\n            --gradient-1: linear-gradient(135deg, #4a90e2, #357abd);\n            --gradient-2: linear-gradient(135deg, #6ab0ff, #4a90e2);\n            --live-color: #ff4757;\n        }\n\n        [data-theme=\"dark\"] {\n            --primary-color: #4a90e2;\n            --secondary-color: #1a2634;\n            --text-color: #e1e8ed;\n            --bg-color: #0f172a;\n            --card-bg: rgba(26, 38, 52, 0.95);\n            --shadow-color: rgba(0, 0, 0, 0.3);\n            --hover-color: #5a9de2;\n            --border-color: #2a3f52;\n        }\n\n        body {\n            background: var(--bg-color);\n            color: var(--text-color);\n            line-height: 1.6;\n            padding-top: 0; /* Added to account for removed fixed header */\n        }\n\n        /* Rest of your CSS styles (excluding header and footer) */\n        /* ... */\n                .banner-section {\n            position: relative;\n            height: 500px;\n            overflow: hidden;\n        }\n\n        .swiper {\n            width: 100%;\n            height: 100%;\n        }\n\n        .swiper-slide {\n            position: relative;\n        }\n\n        .banner-image {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n        }\n\n        .banner-content {\n            position: absolute;\n            bottom: 0;\n            left: 0;\n            right: 0;\n            padding: 2rem 5%;\n            background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);\n            color: white;\n        }\n\n        .banner-content h2 {\n            font-size: 2.5rem;\n            margin-bottom: 1rem;\n        }\n\n        .section {\n            padding: 3rem 5%;\n        }\n\n        .section-header {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 2rem;\n        }\n\n        .section-title {\n            font-size: 1.8rem;\n            color: var(--text-color);\n        }\n\n        .see-all {\n            color: var(--primary-color);\n            text-decoration: none;\n            font-weight: 500;\n        }\n\n        .streams-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n            gap: 1.5rem;\n        }\n\n        .stream-card {\n            background: var(--card-bg);\n            border-radius: 15px;\n            overflow: hidden;\n            box-shadow: 0 5px 15px var(--shadow-color);\n            transition: transform 0.3s ease;\n        }\n\n        .stream-card:hover {\n            transform: translateY(-5px);\n        }\n\n        .stream-thumbnail {\n            position: relative;\n            padding-top: 56.25%;\n        }\n\n        .stream-thumbnail img {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n        }\n\n        .live-badge {\n            position: absolute;\n            top: 1rem;\n            left: 1rem;\n            background: var(--live-color);\n            color: white;\n            padding: 0.3rem 0.8rem;\n            border-radius: 20px;\n            font-size: 0.9rem;\n            font-weight: 600;\n            display: flex;\n            align-items: center;\n            gap: 0.5rem;\n        }\n\n        .live-badge::before {\n            content: '';\n            width: 8px;\n            height: 8px;\n            background: white;\n            border-radius: 50%;\n            animation: pulse 1.5s infinite;\n        }\n\n        .stream-info {\n            padding: 1rem;\n        }\n\n        .stream-title {\n            font-size: 1.2rem;\n            margin-bottom: 0.5rem;\n            color: var(--text-color);\n        }\n\n        .stream-meta {\n            display: flex;\n            justify-content: space-between;\n            color: var(--text-color);\n            opacity: 0.8;\n            font-size: 0.9rem;\n        }\n\n        .events-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n            gap: 1.5rem;\n            margin-bottom: 2rem;\n        }\n\n        .event-card {\n            background: var(--card-bg);\n            border-radius: 15px;\n            padding: 1.5rem;\n            box-shadow: 0 5px 15px var(--shadow-color);\n            transition: transform 0.3s ease;\n            display: flex;\n            flex-direction: column;\n            height: 100%;\n            min-height: 250px;\n            justify-content: space-between;\n        }\n\n        .event-card:hover {\n            transform: translateY(-5px);\n        }\n\n        .event-date {\n            color: var(--primary-color);\n            font-weight: 600;\n            margin-bottom: 0.5rem;\n        }\n\n        .event-meta {\n            display: flex;\n            justify-content: space-between;\n            margin: 1rem 0;\n            font-size: 0.9rem;\n            color: var(--text-color);\n            opacity: 0.8;\n            align-items: center;\n        }\n\n        .event-meta span {\n            display: flex;\n            align-items: center;\n            gap: 0.5rem;\n        }\n\n        .reminder-btn {\n            width: 100%;\n            padding: 0.8rem;\n            border: none;\n            background: var(--primary-color);\n            color: white;\n            border-radius: 8px;\n            cursor: pointer;\n            transition: all 0.3s ease;\n            margin-top: auto;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            gap: 0.5rem;\n            font-weight: 500;\n        }\n\n        .reminder-btn i {\n            font-size: 1rem;\n        }\n\n        .reminder-btn:hover {\n            background: var(--hover-color);\n            transform: translateY(-2px);\n        }\n\n        .event-content {\n            flex-grow: 1;\n            margin-bottom: 1rem;\n        }\n\n        .event-title {\n            font-size: 1.2rem;\n            margin: 0.5rem 0;\n            color: var(--text-color);\n            font-weight: 600;\n        }\n\n        .videos-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n            gap: 1.5rem;\n            margin-bottom: 2rem;\n        }\n\n        .video-card {\n            background: var(--card-bg);\n            border-radius: 15px;\n            overflow: hidden;\n            box-shadow: 0 5px 15px var(--shadow-color);\n            transition: transform 0.3s ease;\n        }\n\n        .video-card:hover {\n            transform: translateY(-5px);\n        }\n\n        .video-thumbnail {\n            position: relative;\n            padding-top: 56.25%;\n        }\n\n        .video-thumbnail img {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n            border-radius: 10px 10px 0 0;\n        }\n\n        .video-duration {\n            position: absolute;\n            bottom: 10px;\n            right: 10px;\n            background: rgba(0, 0, 0, 0.8);\n            color: white;\n            padding: 2px 8px;\n            border-radius: 4px;\n            font-size: 0.9rem;\n        }\n\n        .video-info {\n            padding: 1rem;\n        }\n\n        .video-header {\n            display: flex;\n            gap: 1rem;\n            margin-bottom: 1rem;\n        }\n\n        .video-meta {\n            flex: 1;\n        }\n\n        .video-title {\n            font-size: 1.1rem;\n            margin-bottom: 0.5rem;\n            color: var(--text-color);\n        }\n\n        .university-name {\n            font-size: 0.9rem;\n            color: var(--text-color);\n            opacity: 0.8;\n        }\n\n        .video-stats {\n            display: flex;\n            justify-content: space-between;\n            font-size: 0.9rem;\n            color: var(--text-color);\n            opacity: 0.8;\n        }\n\n        .posts-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n            gap: 1.5rem;\n        }\n\n        .post-card {\n            background: var(--card-bg);\n            border-radius: 15px;\n            padding: 1.5rem;\n            box-shadow: 0 5px 15px var(--shadow-color);\n            transition: transform 0.3s ease;\n        }\n\n        .post-card:hover {\n            transform: translateY(-5px);\n        }\n\n        .post-header {\n            display: flex;\n            align-items: center;\n            gap: 1rem;\n            margin-bottom: 1rem;\n        }\n\n        .university-avatar {\n            width: 40px;\n            height: 40px;\n            border-radius: 50%;\n            object-fit: cover;\n        }\n\n.streams-grid a { text-decoration:none; color: inherit; }\n        .post-meta {\n            flex: 1;\n        }\n\n        .post-time {\n            font-size: 0.9rem;\n            color: var(--text-color);\n            opacity: 0.8;\n        }\n\n        .post-content p {\n            margin-bottom: 1rem;\n            line-height: 1.6;\n        }\n\n        .post-content img {\n            width: 100%;\n            border-radius: 10px;\n            margin: 1rem 0;\n        }\n\n        .post-actions {\n            display: flex;\n            gap: 1rem;\n            margin-top: 1rem;\n            color: var(--text-color);\n            opacity: 0.8;\n        }\n\n        .post-actions button {\n            background: none;\n            border: none;\n            color: var(--text-color);\n            cursor: pointer;\n            padding: 0.5rem 1rem;\n            border-radius: 20px;\n            transition: background-color 0.3s ease;\n        }\n\n        .post-actions button:hover {\n            background: var(--secondary-color);\n        }\n        \n        @keyframes pulse {\n            0% {\n                opacity: 1;\n            }\n\n            50% {\n                opacity: 0.5;\n            }\n\n            100% {\n                opacity: 1;\n            }\n        }\n\n        @media (max-width: 768px) {\n            .banner-section {\n                height: 300px;\n            }\n\n            .banner-content h2 {\n                font-size: 1.8rem;\n            }\n\n            .section {\n                padding: 2rem 5%;\n            }\n\n            .streams-grid,\n            .events-grid,\n            .videos-grid,\n            .posts-grid {\n                grid-template-columns: 1fr;\n            }\n        }\n    "
        }}
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
                <h3 className="stream-title">Talkshow: Khởi Nghiệp Sinh Viên</h3>
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