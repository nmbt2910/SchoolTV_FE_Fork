import React, { useContext, useEffect, useState } from "react";
import "./StudioHeader.scss";
import { Badge, Button, Flex, Image } from "antd";
import { ThemeContext } from "../../context/ThemeContext";
import { Dropdown } from "antd";
import { IoNotifications } from "react-icons/io5";

function StudioHeader() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [countNotification, setCountNotification] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(theme);

  const items = [
    {
      label: "First notification",
      key: "0",
    },
    {
      label: "Second notification",
      key: "1",
    },
    {
      label: "Third notification",
      key: "2",
    },
  ];

  useEffect(() => {
    setCountNotification(items.length);
  }, [items]);

  useEffect(() => {
    // Update currentTheme when theme changes
    setCurrentTheme(theme);
    // Update body's data-theme attribute
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    toggleTheme();
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="studio-header-container">
      <Flex justify="space-between" align="center">
        <div>
          <a href="#" className="logo">
            <i className="fas fa-tv"></i> SchoolTV Studio
          </a>
        </div>

        <Flex align="center">
          <button
            style={{ marginRight: "35px" }}
            className="schoolStudio-switch-button"
          >
            Chuyển đến SchoolTV
          </button>

          <button
            onClick={handleThemeToggle}
            className="theme-toggle studio-header-icon"
            aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            <i className={`fas ${currentTheme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>

          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            className="studio-header-icon"
          >
            <Badge count={countNotification} overflowCount={99}>
              <IoNotifications />
            </Badge>
          </Dropdown>

          <Image
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
            preview={false}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </Flex>
      </Flex>
    </div>
  );
}

export default StudioHeader;