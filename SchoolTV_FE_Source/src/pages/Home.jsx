import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>School TV Show | Nền Tảng Phát Sóng Trực Tuyến Cho Trường Học</title>
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
    rel="stylesheet"
  />
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n            transition: background-color 0.3s, color 0.3s;\n        }\n\n        :root {\n            --primary-color: #4a90e2;\n            --secondary-color: #f0f4f8;\n            --text-color: #2c3e50;\n            --bg-color: #ffffff;\n            --card-bg: rgba(255, 255, 255, 0.95);\n            --shadow-color: rgba(0, 0, 0, 0.1);\n            --hover-color: #357abd;\n            --border-color: #e1e8ed;\n        }\n\n        [data-theme=\"dark\"] {\n            --primary-color: #4a90e2;\n            --secondary-color: #1a2634;\n            --text-color: #e1e8ed;\n            --bg-color: #0f172a;\n            --card-bg: rgba(26, 38, 52, 0.95);\n            --shadow-color: rgba(0, 0, 0, 0.3);\n            --hover-color: #5a9de2;\n            --border-color: #2a3f52;\n        }\n\n        body {\n            min-height: 100vh;\n            background: var(--bg-color);\n            color: var(--text-color);\n            overflow-x: hidden;\n        padding-top: 0px; }\n\n        /* Header Styles */\n        .header {\n            position: fixed;\n            top: 0;\n            left: 0;\n            right: 0;\n            padding: 1rem 5%;\n            background: var(--card-bg);\n            backdrop-filter: blur(10px);\n            z-index: 1000;\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            box-shadow: 0 2px 10px var(--shadow-color);\n        }\n\n        .logo {\n            display: flex;\n            align-items: center;\n            gap: 10px;\n            font-size: 1.5rem;\n            font-weight: bold;\n            color: var(--primary-color);\n            text-decoration: none;\n        }\n\n        .logo i {\n            font-size: 2rem;\n        }\n\n        .nav-links {\n            display: flex;\n            gap: 2rem;\n            align-items: center;\n        }\n\n        .nav-links a {\n            color: var(--text-color);\n            text-decoration: none;\n            font-weight: 500;\n            transition: color 0.3s;\n        }\n\n        .nav-links a:hover {\n            color: var(--primary-color);\n        }\n\n        .theme-toggle {\n            background: none;\n            border: none;\n            color: var(--text-color);\n            cursor: pointer;\n            font-size: 1.2rem;\n            padding: 5px;\n        }\n\n        /* Hero Section */\n        .hero {\n            margin-top: 80px;\n            padding: 4rem 5%;\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n            gap: 2rem;\n            align-items: center;\n            min-height: calc(100vh - 80px);\n            background: linear-gradient(135deg, \n                var(--bg-color) 0%, \n                var(--secondary-color) 100%);\n        }\n\n        .hero-content h1 {\n            font-size: 3.5rem;\n            margin-bottom: 1.5rem;\n            line-height: 1.2;\n            background: linear-gradient(45deg, var(--primary-color), #6ab0ff);\n            -webkit-background-clip: text;\n            -webkit-text-fill-color: transparent;\n        }\n\n        .hero-content p {\n            font-size: 1.2rem;\n            margin-bottom: 2rem;\n            line-height: 1.6;\n            color: var(--text-color);\n            opacity: 0.9;\n        }\n\n        .cta-buttons {\n            display: flex;\n            gap: 1rem;\n        }\n\n        .cta-button {\n            padding: 1rem 2rem;\n            border: none;\n            border-radius: 10px;\n            font-size: 1.1rem;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.3s ease;\n        }\n\n        .primary-button {\n            background: var(--primary-color);\n            color: white;\n        }\n\n        .secondary-button {\n            background: transparent;\n            border: 2px solid var(--primary-color);\n            color: var(--primary-color);\n        }\n\n        .hero-image {\n            position: relative;\n            width: 100%;\n            height: 100%;\n            min-height: 400px;\n        }\n\n        .floating-card {\n            position: absolute;\n            background: var(--card-bg);\n            padding: 20px;\n            border-radius: 15px;\n            box-shadow: 0 10px 30px var(--shadow-color);\n            backdrop-filter: blur(10px);\n        }\n\n        .card-1 {\n            top: 10%;\n            left: 0;\n            width: 280px;\n            animation: float 6s ease-in-out infinite;\n        }\n\n        .card-2 {\n            bottom: 10%;\n            right: 0;\n            width: 300px;\n            animation: float 8s ease-in-out infinite;\n        }\n\n        @keyframes float {\n            0%, 100% { transform: translateY(0); }\n            50% { transform: translateY(-20px); }\n        }\n\n        /* Features Section */\n        .features {\n            padding: 4rem 5%;\n            background: var(--bg-color);\n        }\n\n        .section-title {\n            text-align: center;\n            margin-bottom: 3rem;\n        }\n\n        .section-title h2 {\n            font-size: 2.5rem;\n            color: var(--text-color);\n            margin-bottom: 1rem;\n        }\n\n        .features-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n            gap: 2rem;\n        }\n\n        .feature-card {\n            background: var(--card-bg);\n            padding: 2rem;\n            border-radius: 15px;\n            box-shadow: 0 10px 30px var(--shadow-color);\n            transition: transform 0.3s ease;\n        }\n\n        .feature-card:hover {\n            transform: translateY(-10px);\n        }\n\n        .feature-icon {\n            font-size: 2.5rem;\n            color: var(--primary-color);\n            margin-bottom: 1.5rem;\n        }\n\n        .feature-card h3 {\n            font-size: 1.5rem;\n            margin-bottom: 1rem;\n            color: var(--text-color);\n        }\n\n        .feature-card p {\n            color: var(--text-color);\n            opacity: 0.9;\n            line-height: 1.6;\n        }\n\n        /* Statistics Section */\n        .statistics {\n            padding: 4rem 5%;\n            background: linear-gradient(135deg, \n                var(--secondary-color) 0%, \n                var(--bg-color) 100%);\n        }\n\n        .stats-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n            gap: 2rem;\n            text-align: center;\n        }\n\n        .stat-card {\n            background: var(--card-bg);\n            padding: 2rem;\n            border-radius: 15px;\n            box-shadow: 0 10px 30px var(--shadow-color);\n        }\n\n        .stat-number {\n            font-size: 2.5rem;\n            font-weight: bold;\n            color: var(--primary-color);\n            margin-bottom: 0.5rem;\n        }\n\n        .stat-label {\n            color: var(--text-color);\n            font-size: 1.1rem;\n        }\n\n        /* Footer */\n        .footer {\n            background: var(--card-bg);\n            padding: 3rem 5%;\n            margin-top: 4rem;\n        }\n\n        .footer-content {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n            gap: 2rem;\n        }\n\n        .footer-section h3 {\n            color: var(--text-color);\n            margin-bottom: 1.5rem;\n        }\n\n        .footer-section p,\n        .footer-section a {\n            color: var(--text-color);\n            opacity: 0.9;\n            line-height: 1.6;\n            text-decoration: none;\n            display: block;\n            margin-bottom: 0.5rem;\n        }\n\n        .footer-section a:hover {\n            color: var(--primary-color);\n        }\n\n        .social-links {\n            display: flex;\n            gap: 1rem;\n            margin-top: 1rem;\n        }\n\n        .social-links a {\n            color: var(--text-color);\n            font-size: 1.5rem;\n            transition: color 0.3s ease;\n        }\n\n        .social-links a:hover {\n            color: var(--primary-color);\n        }\n\n        /* Responsive Design */\n        @media (max-width: 768px) {\n            .hero {\n                grid-template-columns: 1fr;\n                text-align: center;\n            }\n\n            .hero-content h1 {\n                font-size: 2.5rem;\n            }\n\n            .cta-buttons {\n                justify-content: center;\n            }\n\n            .hero-image {\n                display: none;\n            }\n\n            .nav-links {\n                display: none;\n            }\n        }\n\n        /* Animation Classes */\n        .fade-up {\n            opacity: 0;\n            transform: translateY(20px);\n            transition: all 0.6s ease;\n        }\n\n        .fade-up.active {\n            opacity: 1;\n            transform: translateY(0);\n        }\n\n        /* Custom Scrollbar */\n        ::-webkit-scrollbar {\n            width: 10px;\n        }\n\n        ::-webkit-scrollbar-track {\n            background: var(--bg-color);\n        }\n\n        ::-webkit-scrollbar-thumb {\n            background: var(--primary-color);\n            border-radius: 5px;\n        }\n\n        ::-webkit-scrollbar-thumb:hover {\n            background: var(--hover-color);\n        }\n    "
    }}
  />
  <section className="hero">
    <div className="hero-content" data-aos="fade-right">
      <h1>Nền Tảng TV Show Trực Tuyến Cho Trường Học</h1>
      <p>
        Kết nối và chia sẻ những khoảnh khắc đáng nhớ của trường học thông qua
        nền tảng phát sóng trực tuyến chuyên nghiệp.
      </p>
      <div className="cta-buttons">
        <button onClick={() => navigate("watchHome")} className="cta-button primary-button">Dùng Thử Miễn Phí</button>
        <button onClick={() => navigate("watchHome")} className="cta-button secondary-button">Tìm Hiểu Thêm</button>
      </div>
    </div>
    <div className="hero-image" data-aos="fade-left">
      <div className="floating-card card-1">
        <h3>Đang Phát Sóng</h3>
        <p>Lễ Khai Giảng 2023 - ĐH Bách Khoa</p>
        <p>
          <i className="fas fa-users" /> 1.2k người xem
        </p>
      </div>
      <div className="floating-card card-2">
        <h3>Sắp Diễn Ra</h3>
        <p>Hội Thảo Hướng Nghiệp - ĐH Kinh Tế</p>
        <p>
          <i className="far fa-clock" /> 2 giờ nữa
        </p>
      </div>
    </div>
  </section>
  <section className="features">
    <div className="section-title" data-aos="fade-up">
      <h2>Tính Năng Nổi Bật</h2>
      <p>Khám phá những tính năng độc đáo của nền tảng</p>
    </div>
    <div className="features-grid">
      <div className="feature-card" data-aos="fade-up" data-aos-delay={100}>
        <i className="fas fa-broadcast-tower feature-icon" />
        <h3>Phát Sóng Trực Tiếp</h3>
        <p>
          Dễ dàng thiết lập và phát sóng các sự kiện trực tiếp với chất lượng
          cao
        </p>
      </div>
      <div className="feature-card" data-aos="fade-up" data-aos-delay={200}>
        <i className="fas fa-chart-line feature-icon" />
        <h3>Thống Kê Chi Tiết</h3>
        <p>Theo dõi số liệu người xem và tương tác trong thời gian thực</p>
      </div>
      <div className="feature-card" data-aos="fade-up" data-aos-delay={300}>
        <i className="fas fa-clock feature-icon" />
        <h3>Lịch Phát Sóng</h3>
        <p>Quản lý và lên lịch phát sóng các chương trình một cách linh hoạt</p>
      </div>
    </div>
  </section>
  <section className="statistics">
    <div className="stats-grid">
      <div className="stat-card" data-aos="fade-up">
        <div className="stat-number">100+</div>
        <div className="stat-label">Trường Đại Học</div>
      </div>
      <div className="stat-card" data-aos="fade-up" data-aos-delay={100}>
        <div className="stat-number">50K+</div>
        <div className="stat-label">Sinh Viên</div>
      </div>
      <div className="stat-card" data-aos="fade-up" data-aos-delay={200}>
        <div className="stat-number">1000+</div>
        <div className="stat-label">Chương Trình</div>
      </div>
      <div className="stat-card" data-aos="fade-up" data-aos-delay={300}>
        <div className="stat-number">99.9%</div>
        <div className="stat-label">Uptime</div>
      </div>
    </div>
  </section>

</>

  );
}