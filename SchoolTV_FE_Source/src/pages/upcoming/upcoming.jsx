import "./upcoming.scss";

function UpComing() {
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
                src="https://vcdn1-vnexpress.vnecdn.net/2023/02/11/dhbkhn-7506-1652177227-jpeg-16-9288-9163-1676080515.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=dvo1YbJr-s2jbo159tyuNA"
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
      <section className="section video-release">
        <div>
          <h2 className="section-header">Video mới nhất</h2>
          <div className="event-date">
            <i className="far fa-calendar" /> 25/12/2023 - 14:00
          </div>
        </div>
        <div className="section-notification">
          <h2 className="title-event">Nhận thông báo cho sự kiện này</h2>
          <button className="reminder-btn">
            <i className="far fa-bell" /> Đặt Lịch Nhắc
          </button>
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Về sự kiện</h2>
        </div>
        <div className="section-content">
          Chúng tôi tại Career Bliss Academy hân hạnh được mời bạn tham dự Lễ
          Trao Bằng Tốt Nghiệp, nơi chúng ta cùng nhau tôn vinh những nỗ lực và
          thành tựu của các học viên xuất sắc.
          <br />
          🌟 Sứ mệnh của chúng tôi là giúp mọi người khám phá ánh sáng bên
          trong, phát huy tối đa tiềm năng và tạo dựng một cuộc sống hạnh phúc,
          thành công. Thành công của các bạn chính là niềm tự hào và động lực để
          chúng tôi tiếp tục thực hiện sứ mệnh này.
          <br />
          💬 "Khi mọi người thực sự khai phá tiềm năng của bản thân và áp dụng
          những kỹ năng đã học vào cuộc sống, họ không chỉ thay đổi bản thân mà
          còn tạo ra sự khác biệt trong cộng đồng. Sự thành công của họ minh
          chứng cho giá trị mà Career Bliss Academy luôn theo đuổi."
        </div>
      </section>
    </>
  );
}

export default UpComing;
