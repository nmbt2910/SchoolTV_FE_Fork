import React, { useEffect, useState } from 'react';
import './Header.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    const handleThemeToggle = () => {
      const newTheme =
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    };

    themeToggle.addEventListener('click', handleThemeToggle);

    return () => {
      themeToggle.removeEventListener('click', handleThemeToggle);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <a href="watchHome" className="logo">
        <i className="fas fa-tv"></i> SchoolTV
      </a>
      
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <a href="businessHome" onClick={() => setIsMenuOpen(false)}>Trang Chủ</a>
        <a href="liveList" onClick={() => setIsMenuOpen(false)}>Trực Tiếp</a>
        <a href="channelList" onClick={() => setIsMenuOpen(false)}>Trường Học</a>
        <button id="theme-toggle" className="theme-toggle">
          <i className="fas fa-moon"></i>
        </button>
        <a href="login" className="cta-button primary-button" onClick={() => setIsMenuOpen(false)}>
          Đăng Nhập
        </a>
      </nav>
    </header>
  );
};

export default Header;