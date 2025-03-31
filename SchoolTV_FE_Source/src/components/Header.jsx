import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import apiFetch from '../config/baseAPI';
import darkLogo from '../assets/dark-tv-logo.png';
import lightLogo from '../assets/light-tv-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // First try to load from localStorage for immediate display
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUser(parsedUserData);
          console.log("Loaded user data from localStorage:", parsedUserData);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      }

      // Determine if user is Admin from localStorage
      const isAdmin = storedUserData && JSON.parse(storedUserData).roleName === "Admin";
      const accountID = storedUserData && JSON.parse(storedUserData).accountID;

      // Then fetch fresh data from the appropriate API
      const apiUrl = isAdmin 
        ? `accounts/admin/${accountID}`
        : 'accounts/info';

      apiFetch(apiUrl, {
        headers: {
          'accept': '*/*'
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch user data: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("API response for user info:", data);
          
          // Handle different response structures for Admin vs regular user
          const userData = isAdmin ? {
            accountID: data.accountID,
            username: data.username,
            email: data.email,
            fullname: data.fullname,
            address: data.address,
            phoneNumber: data.phoneNumber,
            roleName: data.role.roleName
          } : {
            accountID: data.accountID,
            username: data.username,
            email: data.email,
            fullname: data.fullname,
            address: data.address,
            phoneNumber: data.phoneNumber,
            roleName: data.roleName || (storedUserData ? JSON.parse(storedUserData).roleName : null)
          };
          
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
        })
        .catch(err => {
          console.error('Error fetching user info:', err);
          if (err.message.includes('Failed to fetch user data')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUser(null);
          }
        });
    }

    AOS.init({ duration: 800, once: true });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = theme === 'dark' 
        ? '/img/dark-tv-logo.png' 
        : '/img/light-tv-logo.png';
    }
  }, [theme]);

  // Check for roles in user object
  const isSchoolOwner = user && user.roleName === "SchoolOwner";
  const isAdmin = user && user.roleName === "Admin";

  return (
    <header className="header">
      <a href="/" className="logo">
        <img 
          src={theme === 'dark' ? darkLogo : lightLogo} 
          alt="SchoolTV Logo" 
          className="logo-img" 
        />
        SchoolTV
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
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname || 'User')}&background=random`}
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
                {isAdmin && (
                  <>
                    <a href="/adminpage" className="dropdown-item studio-link">
                      <i className="fas fa-shield-alt"></i> Admin Dashboard
                    </a>
                    <div className="dropdown-divider"></div>
                  </>
                )}
                {isSchoolOwner && (
                  <>
                    <a href="school-studio/statistics" className="dropdown-item studio-link">
                      <i className="fas fa-tv"></i> SchoolTV Studio
                    </a>
                    <div className="dropdown-divider"></div>
                  </>
                )}
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