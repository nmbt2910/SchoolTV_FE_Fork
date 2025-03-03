import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const accountID = localStorage.getItem('accountID');

    if (token && accountID) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUser(parsedUserData);
        console.log("Parsed user data:", parsedUserData);
      }

      fetch(`https://localhost:44316/api/accounts/admin/${accountID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch user data');
          return res.json();
        })
        .then(data => {
          const userData = {
            ...data,
            roleName: data.role?.roleName
          };
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          if (err.message === 'Failed to fetch user data') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('accountID');
            localStorage.removeItem('userData');
          }
        });
    }

    AOS.init({ duration: 800, once: true });
  }, []);

  console.log("Current user state:", user);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('accountID');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/login');
  };

  // Check for role in both places: direct roleName and nested role.roleName
  const isSchoolOwner = user && (user.roleName === "SchoolOwner" || user.role?.roleName === "SchoolOwner");

  return (
    <header className="header">
      <a href="/" className="logo">
        <i className="fas fa-tv"></i> SchoolTV
      </a>

      <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <a href="/" onClick={() => setIsMenuOpen(false)}>Trang Chủ</a>
        <a href="liveList" onClick={() => setIsMenuOpen(false)}>Trực Tiếp</a>
        <a href="channelList" onClick={() => setIsMenuOpen(false)}>Trường Học</a>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>

        {user ? (
          <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=random`}
              alt="Profile"
              className="profile-pic"
            />
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <button
                    className="mobile-dropdown-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <p className="user-name">{user.fullname}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                {isSchoolOwner && (
                  <a href="/StatisticsPage" className="dropdown-item studio-link">
                    <i className="fas fa-tv"></i> SchoolTV Studio
                  </a>
                )}
                <div className="dropdown-divider"></div>
                <a href="/userProfile" className="dropdown-item">
                  <i className="fas fa-user"></i> Hồ sơ
                </a>
                <a href="#" className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </a>
              </div>
            )}
          </div>
        ) : (
          <a href="login" className="cta-button primary-button" onClick={() => setIsMenuOpen(false)}>
            Đăng Nhập
          </a>
        )}
      </nav>
    </header>
  );
};

export default Header;