import { createContext, useContext, useState } from 'react';

// Tạo context để cung cấp trạng thái người dùng trong toàn bộ ứng dụng
export const UserContext = createContext();

// Cung cấp UserContext cho toàn bộ ứng dụng
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")) || null);

  console.log(user);  // Kiểm tra giá trị của user khi khởi tạo

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("userData");
  };

  const checkRole = (role) => {
    return user && user.roleName.toLowerCase() === role.toLowerCase();
  };  

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, checkRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng user context ở bất kỳ đâu trong ứng dụng
export const useUser = () => useContext(UserContext);
