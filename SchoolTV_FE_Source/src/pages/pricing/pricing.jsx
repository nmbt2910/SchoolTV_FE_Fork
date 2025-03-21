import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pricing.css";

const PricingPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [error, setError] = useState(null); // Thêm state error

  const featureMapping = {
    1: [
      "Tối đa 500 videos",
      "50 giờ stream liên tục",
      "Lưu trữ 30 ngày",
      "Hỗ trợ cơ bản",
    ],
    2: [
      "Không giới hạn videos",
      "20 giờ stream liên tục",
      "Lưu trữ 90 ngày",
      "Hỗ trợ 24/7",
    ],
    3: [
      "Giải pháp tùy chỉnh",
      "API tích hợp",
      "SLA cam kết",
      "Bảo mật nâng cao",
    ],
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Lấy token từ localStorage
    if (!token) {
      console.error("No token found");
      setError("No token found");
      setLoading(false);
      return;
    }

    setLoading(true); // Bắt đầu tải
    fetch(`https://localhost:7057/api/Package/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Raw API data:", data);
        if (!data.$values) {
          console.error("No $values in API response");
          setError("No packages data available");
          return;
        }
        // Xử lý dữ liệu và thêm featureMapping
        const formattedPackages = data.$values.map((pkg) => ({
          ...pkg,
          features: featureMapping[pkg.packageID] || [
            "Tính năng đang cập nhật...",
          ],
        }));
        setPackages(formattedPackages); // Gán dữ liệu vào state
        console.log("Formatted packages:", formattedPackages);
        setError(null); // Xóa lỗi nếu thành công
      })
      .catch((error) => {
        console.error("Error fetching packages:", error);
        setError(`Failed to fetch packages: ${error.message}`);
      })
      .finally(() => {
        setLoading(false); // Kết thúc tải
      });
  }, []);

  const handlePayment = (selectedPackage) => {
    // Store the selected package in localStorage
    localStorage.setItem("selectedPackage", JSON.stringify(selectedPackage));
    navigate("/checkout");
  };

  return (
    <>
      <div className="pricing-header">
        <h1>Lựa Chọn Gói Dịch Vụ Phù Hợp</h1>
        <p>
          Giải pháp streaming và học trực tuyến toàn diện cho mọi quy mô trường
          học
        </p>
      </div>

      <div className="pricing-container">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : packages.length === 0 ? (
          <p>Không có gói nào để hiển thị</p>
        ) : (
          packages.map((pkg, index) => (
            <div key={index} className="pricing-card">
              <h3>{pkg.name}</h3>
              <div className="price">
                {pkg.price.toLocaleString()} VND
                <span className="price-span">/tháng</span>
              </div>
              <div className="pricing-features">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="feature">
                    <span className="pricing-feature-icon">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => handlePayment(pkg)} className="try-button">
                Mua ngay
              </button>
              <button className="secondary-button">Tìm hiểu thêm</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PricingPage;
