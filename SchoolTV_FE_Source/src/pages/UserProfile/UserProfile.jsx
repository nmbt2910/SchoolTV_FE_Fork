import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Row, Col, Input, Button, notification, Spin } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    LockOutlined,
    EditOutlined,
    KeyOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    VideoCameraOutlined,
    BookOutlined,
    CalendarOutlined,
    GoogleOutlined
} from '@ant-design/icons';
import './UserProfile.css';
import apiFetch from '../../config/baseAPI';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const initialValuesRef = useRef({});

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            const storedUserData = localStorage.getItem('userData');

            if (!token) {
                setLoading(false);
                notification.error({
                    message: 'Lỗi xác thực!',
                    description: 'Bạn cần đăng nhập để xem thông tin người dùng.',
                    placement: 'topRight'
                });
                return;
            }

            if (storedUserData) {
                setUser(JSON.parse(storedUserData));
            }

            try {
                const response = await apiFetch('accounts/info', {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch user data');
                }

                const data = await response.json();
                const userData = JSON.parse(localStorage.getItem('userData')) || {};

                const updatedUserData = {
                    ...data,
                    roleName: userData.roleName || 'User'
                };

                setUser(updatedUserData);
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.message.includes('401')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    notification.error({
                        message: 'Phiên đăng nhập hết hạn!',
                        description: 'Vui lòng đăng nhập lại để tiếp tục.',
                        placement: 'topRight'
                    });
                } else {
                    notification.error({
                        message: 'Lỗi!',
                        description: 'Không thể tải thông tin người dùng.',
                        placement: 'topRight'
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateInfo = async (values) => {
        try {
            // 1. Kiểm tra giá trị ban đầu
            if (!initialValuesRef.current) {
                notification.error({
                    message: 'Lỗi hệ thống!',
                    description: 'Không thể xác định dữ liệu gốc',
                    placement: 'topRight'
                });
                return;
            }

            // 2. Lọc các trường thay đổi
            const changedFields = Object.keys(values).reduce((acc, key) => {
                const currentValue = values[key];
                const initialValue = initialValuesRef.current[key];

                // So sánh chuỗi đã được trim()
                if (String(currentValue).trim() !== String(initialValue).trim()) {
                    acc[key] = currentValue;
                }
                return acc;
            }, {});

            // 3. Kiểm tra thay đổi
            if (Object.keys(changedFields).length === 0) {
                notification.info({
                    message: 'Thông báo',
                    description: 'Không có thông tin nào được thay đổi',
                    placement: 'topRight',
                    duration: 3
                });
                return;
            }

            // 4. Ánh xạ tên trường
            const fieldMapping = {
                profile_username: 'username',
                profile_fullname: 'fullname',
                profile_phone: 'phoneNumber',
                profile_address: 'address'
            };

            // 5. Tạo payload
            const payload = Object.entries(changedFields).reduce((acc, [formField, value]) => {
                const apiField = fieldMapping[formField];
                if (apiField) {
                    acc[apiField] = value.trim(); // Clean data
                }
                return acc;
            }, {});

            // 6. Gửi request
            const response = await apiFetch('accounts/update', {
                method: 'PATCH',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // 7. Xử lý response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cập nhật thất bại');
            }

            // 8. Cập nhật state và localStorage
            const updatedUser = await response.json();
            const updatedUserWithRole = {
                ...updatedUser.account,
                roleName: user.roleName // Giữ nguyên role
            };

            setUser(updatedUserWithRole);
            localStorage.setItem('userData', JSON.stringify(updatedUserWithRole));

            // 9. Thông báo thành công
            notification.success({
                message: 'Cập nhật thành công!',
                description: 'Thông tin đã được lưu',
                placement: 'topRight',
                duration: 3
            });

            // 10. Đóng modal và reset form
            setEditModalVisible(false);
            form.resetFields();

        } catch (error) {
            console.error('Update error:', error);

            // 11. Xử lý thông báo lỗi
            const errorMessage = error.message.includes('unique constraint')
                ? 'Email hoặc tên đăng nhập đã tồn tại'
                : error.message || 'Lỗi không xác định';

            notification.error({
                message: 'Cập nhật thất bại!',
                description: errorMessage,
                placement: 'topRight',
                duration: 4
            });
        }
    };

    const handlePasswordChange = async (values) => {
        if (values.newPassword !== values.confirmNewPassword) {
            notification.error({
                message: 'Lỗi!',
                description: 'Mật khẩu mới không khớp.',
                placement: 'topRight',
            });
            return;
        }

        try {
            const response = await apiFetch('accounts/change-password', {
                method: 'PATCH',
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                    confirmNewPassword: values.confirmNewPassword
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.text(); // Đọc response dưới dạng text trước
            if (!response.ok) {
                // Thử parse JSON nếu có thể, nếu không thì dùng plain text
                try {
                    const errorData = JSON.parse(data);
                    throw new Error(errorData.message || 'Password change failed');
                } catch {
                    throw new Error(data || 'Password change failed');
                }
            }

            notification.success({
                message: 'Thành công!',
                description: 'Mật khẩu của bạn đã được cập nhật.',
                placement: 'topRight',
                duration: 3,
            });

            setPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            console.error('Password change error:', error);
            let errorDescription = error.message || 'Đã có lỗi xảy ra khi cập nhật mật khẩu.';

            // Xử lý riêng cho lỗi mật khẩu hiện tại không đúng
            if (error.message.includes("Current password is incorrect")) {
                errorDescription = "Mật khẩu hiện tại đã nhập không chính xác.";
            }

            notification.error({
                message: 'Cập nhật mật khẩu thất bại!',
                description: errorDescription,
                placement: 'topRight',
                duration: 4,
            });
        }
    };

    const passwordValidationRules = {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt. Không bao gồm dấu chấm.'
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="error-container">
                <h2>Không tìm thấy thông tin người dùng</h2>
                <p>Vui lòng đăng nhập lại để tiếp tục.</p>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            <div className="user-profile-header">
                <div className="user-profile-header-content">
                    <div className="user-profile-avatar-wrapper">
                        <div className="user-profile-avatar">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&size=200&background=random`}
                                alt={user.fullname}
                            />
                            <div className="user-profile-avatar-edit">
                                <EditOutlined />
                            </div>
                        </div>
                    </div>
                    <div className="user-profile-main-info">
                        <h1>{user.fullname}</h1>
                        {user.roleName.toLowerCase() !== 'schoolowner' && (
                        <p className="user-profile-username">@{user.username}</p>
                        )}
                        <p className="user-profile-bio">Học sinh lớp 12 - THPT Chu Văn An. Đam mê công nghệ và khoa học máy tính. 🚀</p>
                        <div className="user-profile-actions">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    const initialValues = {
                                        profile_username: user.username,
                                        profile_email: user.email,
                                        profile_fullname: user.fullname,
                                        profile_phone: user.phoneNumber || '',
                                        profile_address: user.address || ''
                                    };
                                    form.setFieldsValue(initialValues);
                                    initialValuesRef.current = initialValues; // Cập nhật ref
                                    setEditModalVisible(true);
                                }}
                                className="user-profile-edit-btn"
                            >
                                Chỉnh Sửa Hồ Sơ
                            </Button>

                            <Button
                                icon={<KeyOutlined />}
                                onClick={() => {
                                    passwordForm.resetFields();
                                    setPasswordModalVisible(true);
                                }}
                                className="user-profile-password-btn"
                            >
                                Đổi Mật Khẩu
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="user-profile-content">
                <div className="content-left">
                    <div className="user-profile-info-card contact-info">
                        <h2>Thông Tin Liên Hệ</h2>
                        <div className="user-profile-info-list">
                            <div className="user-profile-info-item">
                                <div className="info-icon">
                                    <MailOutlined />
                                </div>
                                <div>
                                    <label>Email</label>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                            <div className="user-profile-info-item">
                                <div className="info-icon">
                                    <PhoneOutlined />
                                </div>
                                <div>
                                    <label>Số điện thoại</label>
                                    <span>{user.phoneNumber || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                            <div className="user-profile-info-item">
                                <div className="info-icon">
                                    <EnvironmentOutlined />
                                </div>
                                <div>
                                    <label>Địa chỉ</label>
                                    <span>{user.address || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="user-profile-info-card connected-accounts">
                        <h2>Tài Khoản Liên Kết</h2>
                        <div className="user-profile-account-item">
                            <div className="user-profile-account-icon">
                                <GoogleOutlined />
                            </div>
                            <div className="user-profile-account-info">
                                <span>Google Account</span>
                                <p>{user.email}</p>
                            </div>
                            <div className="user-profile-account-status connected">
                                Đã liên kết
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content-right">
                    <div className="user-profile-info-card recent-activities">
                        <div className="activity-background"></div>
                        <h2>Hoạt Động Gần Đây</h2>
                        <div className="user-profile-activity-list">
                            <div className="user-profile-activity-item live">
                                <div className="user-profile-activity-icon">
                                    <VideoCameraOutlined />
                                </div>
                                <div className="user-profile-activity-content">
                                    <span className="user-profile-activity-tag">LIVE</span>
                                    <h3>Hội Thảo: Định Hướng Ngành CNTT</h3>
                                    <p>ĐH Bách Khoa HN</p>
                                    <span className="user-profile-activity-time">2 giờ trước</span>
                                </div>
                            </div>

                            <div className="user-profile-activity-item">
                                <div className="user-profile-activity-icon">
                                    <BookOutlined />
                                </div>
                                <div className="user-profile-activity-content">
                                    <span className="user-profile-activity-tag">VIDEO</span>
                                    <h3>Ôn Tập Toán: Giải Tích</h3>
                                    <p>Thầy Nguyễn Văn B</p>
                                    <span className="user-profile-activity-time">Hôm qua</span>
                                </div>
                            </div>

                            <div className="user-profile-activity-item">
                                <div className="user-profile-activity-icon">
                                    <CalendarOutlined />
                                </div>
                                <div className="user-profile-activity-content">
                                    <span className="user-profile-activity-tag">SỰ KIỆN</span>
                                    <h3>Ngày Hội Tư Vấn Tuyển Sinh 2024</h3>
                                    <p>ĐH Quốc Gia HN</p>
                                    <span className="user-profile-activity-time">2 ngày trước</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Cập nhật thông tin"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                className="user-profile-modal"
                width={800}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateInfo}
                    className="user-profile-update-form"
                >
                    <Row gutter={24}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="profile_username"
                                label="Tên người dùng"
                                rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Nhập tên người dùng"
                                    className="user-profile-input"
                                />
                            </Form.Item>

                            <Form.Item
                                name="profile_fullname"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Nhập họ và tên đầy đủ"
                                    className="user-profile-input"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="profile_phone"
                                label="Số điện thoại"
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="Nhập số điện thoại"
                                    className="user-profile-input"
                                />
                            </Form.Item>

                            <Form.Item
                                name="profile_address"
                                label="Địa chỉ"
                            >
                                <Input
                                    prefix={<HomeOutlined />}
                                    placeholder="Nhập địa chỉ"
                                    className="user-profile-input"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Cập nhật thông tin
                        </Button>
                    </Form.Item>

                    <div className="user-profile-modal-footer-info">
                        ℹ️ Cập nhật thông tin của bạn sẽ giúp chúng tôi phục vụ bạn tốt hơn.
                    </div>
                </Form>
            </Modal>

            <Modal
                title="Đổi mật khẩu"
                open={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                footer={null}
                className="user-profile-modal"
                width={600}
                centered
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                    className="user-profile-password-form"
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="currentPassword"
                                label="Mật khẩu hiện tại"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="user-profile-input"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="newPassword"
                                label="Mật khẩu mới"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                    { ...passwordValidationRules }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu mới"
                                    className="user-profile-input"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="confirmNewPassword"
                                label="Xác nhận mật khẩu mới"
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="user-profile-input"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>

                    <div className="user-profile-modal-footer-info">
                        🔒 Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt. Không bao gồm dấu chấm.
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default UserProfile;