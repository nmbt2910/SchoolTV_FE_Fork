import React, { useContext, useEffect, useState } from "react";
import "./StudioHeader.scss";
import { Badge, Drawer, Flex, Image } from "antd";
import { ThemeContext } from "../../context/ThemeContext";
import { Dropdown } from "antd";
import { IoMenu, IoNotifications } from "react-icons/io5";

function StudioHeader() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [countNotification, setCountNotification] = useState(0);
  const [openSmallMenu, setOpenSmallMenu] = useState(false);
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

  const handleSmallMenu = () => {
    setOpenSmallMenu(!openSmallMenu);
  };

  const onCloseSmallMenu = () => {
    setOpenSmallMenu(false);
  };

  const handleCloseMenuResize = () => {
    if (window.innerWidth > 1023) {
      setOpenSmallMenu(false);
    }
  };

  useEffect(() => {
    setCountNotification(items.length);
  }, [items]);

  useEffect(() => {
    handleCloseMenuResize();
    window.addEventListener("resize", handleCloseMenuResize);
  
    // Cleanup khi component unmount
    return () => {
      window.removeEventListener("resize", handleCloseMenuResize);
    };
  }, []);
  
  useEffect(() => {
    // Update currentTheme when theme changes
    setCurrentTheme(theme);
  
    // Update body's data-theme attribute
    document.body.setAttribute("data-theme", theme);
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

        <Flex align="center" className="responsive-large-menu">
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

        <div className="responsive-small-menu" onClick={handleSmallMenu}>
          <IoMenu />
        </div>

        <Drawer
          placement={"right"}
          closable={false}
          open={openSmallMenu}
          onClose={onCloseSmallMenu}
          width={200}
        >
          <Flex vertical align="center" gap={16}>
            <button className="schoolStudio-switch-button">
              Chuyển đến SchoolTV
            </button>

            <button
              onClick={toggleTheme}
              className="theme-toggle studio-header-icon"
            >
              {theme === "light" ? (
                <i className="fas fa-moon"></i>
              ) : (
                <i className="fas fa-sun"></i>
              )}
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
        </Drawer>
      </Flex>
    </div>
  );
}

export default StudioHeader;
