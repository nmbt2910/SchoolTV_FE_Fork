import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();

    useEffect(() => {
        const accountID = localStorage.getItem('accountID');
        const token = localStorage.getItem('authToken');
        const storedUserData = localStorage.getItem('userData');

        if (!accountID || !token) {
            setLoading(false);
            return;
        }

        if (storedUserData) {
            setUser(JSON.parse(storedUserData));
            setLoading(false);
        }

        axios.get(`https://localhost:44316/api/accounts/admin/${accountID}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                if (response.data) {
                    setUser(response.data);
                    localStorage.setItem('userData', JSON.stringify(response.data));
                } else {
                    throw new Error('No user data received');
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('accountID');
                    localStorage.removeItem('userData');
                }
                notification.error({
                    message: 'Lỗi!',
                    description: 'Không thể tải thông tin người dùng.',
                    placement: 'topRight'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleUpdateInfo = async (values) => {
        try {
            const mappedValues = {
                username: values.profile_username,
                email: values.profile_email,
                fullname: values.profile_fullname,
                phoneNumber: values.profile_phone,
                address: values.profile_address
            };
            const accountID = localStorage.getItem('accountID');
            const token = localStorage.getItem('authToken');

            const response = await axios.patch(
                `https://localhost:44316/api/accounts/update/${accountID}`,
                mappedValues,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setUser(response.data.account);
                localStorage.setItem('userData', JSON.stringify(response.data.account));

                notification.success({
                    message: 'Cập nhật thành công!',
                    description: 'Thông tin của bạn đã được cập nhật.',
                    placement: 'topRight',
                    duration: 3,
                });

                setEditModalVisible(false);
                form.resetFields();
            }
        } catch (error) {
            notification.error({
                message: 'Cập nhật thất bại!',
                description: error.response?.data?.message || 'Đã có lỗi xảy ra khi cập nhật thông tin.',
                placement: 'topRight',
                duration: 4,
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
            const accountID = localStorage.getItem('accountID');
            const token = localStorage.getItem('authToken');

            const response = await axios.patch(
                `https://localhost:44316/api/accounts/change-password/${accountID}`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                notification.success({
                    message: 'Thành công!',
                    description: 'Mật khẩu của bạn đã được cập nhật.',
                    placement: 'topRight',
                    duration: 3,
                });

                setPasswordModalVisible(false);
                passwordForm.resetFields();
            }
        } catch (error) {
            notification.error({
                message: 'Cập nhật mật khẩu thất bại!',
                description: error.response?.data?.message || 'Đã có lỗi xảy ra khi cập nhật mật khẩu.',
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
        <div className="school-profile-container">
            <div className="school-profile-header">
                <div className="header-content">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&size=200&background=random`}
                                alt={user.fullname}
                            />
                            <div className="avatar-edit">
                                <EditOutlined />
                            </div>
                        </div>
                    </div>
                    <div className="profile-main-info">
                        <h1>{user.fullname}</h1>
                        <p className="username-userprofile">@{user.username}</p>
                        <p className="bio">Học sinh lớp 12 - THPT Chu Văn An. Đam mê công nghệ và khoa học máy tính. 🚀</p>
                        <div className="profile-actions">
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => setEditModalVisible(true)}
                                className="edit-profile-btn"
                            >
                                Chỉnh Sửa Hồ Sơ
                            </Button>
                            <Button
                                icon={<KeyOutlined />}
                                onClick={() => setPasswordModalVisible(true)}
                                className="change-password-btn"
                            >
                                Đổi Mật Khẩu
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="school-profile-content">
                <div className="content-left">
                    <div className="info-card contact-info">
                        <h2>Thông Tin Liên Hệ</h2>
                        <div className="info-list">
                            <div className="info-item">
                                <MailOutlined />
                                <div>
                                    <label>Email</label>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <PhoneOutlined />
                                <div>
                                    <label>Số điện thoại</label>
                                    <span>{user.phoneNumber || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <EnvironmentOutlined />
                                <div>
                                    <label>Địa chỉ</label>
                                    <span>{user.address || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-card connected-accounts">
                        <h2>Tài Khoản Liên Kết</h2>
                        <div className="account-item">
                            <div className="account-icon">
                                <GoogleOutlined />
                            </div>
                            <div className="account-info">
                                <span>Google Account</span>
                                <p>{user.email}</p>
                            </div>
                            <div className="account-status connected">
                                Đã liên kết
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content-right">
                    <div className="info-card recent-activities">
                        <h2>Hoạt Động Gần Đây</h2>
                        <div className="activity-list">
                            <div className="activity-item live">
                                <div className="activity-icon">
                                    <VideoCameraOutlined />
                                </div>
                                <div className="activity-content">
                                    <span className="activity-tag">LIVE</span>
                                    <h3>Hội Thảo: Định Hướng Ngành CNTT</h3>
                                    <p>ĐH Bách Khoa HN</p>
                                    <span className="activity-time">2 giờ trước</span>
                                </div>
                            </div>

                            <div className="activity-item">
                                <div className="activity-icon">
                                    <BookOutlined />
                                </div>
                                <div className="activity-content">
                                    <span className="activity-tag">VIDEO</span>
                                    <h3>Ôn Tập Toán: Giải Tích</h3>
                                    <p>Thầy Nguyễn Văn B</p>
                                    <span className="activity-time">Hôm qua</span>
                                </div>
                            </div>

                            <div className="activity-item">
                                <div className="activity-icon">
                                    <CalendarOutlined />
                                </div>
                                <div className="activity-content">
                                    <span className="activity-tag">SỰ KIỆN</span>
                                    <h3>Ngày Hội Tư Vấn Tuyển Sinh 2024</h3>
                                    <p>ĐH Quốc Gia HN</p>
                                    <span className="activity-time">2 ngày trước</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Cập nhật thông tin"
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                className="school-profile-modal profile-update-modal"
                width={800}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateInfo}
                    initialValues={{
                        profile_username: user.username,
                        profile_email: user.email,
                        profile_fullname: user.fullname,
                        profile_phone: user.phoneNumber,
                        profile_address: user.address
                    }}
                    className="profile-update-form"
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
                                />
                            </Form.Item>

                            <Form.Item
                                name="profile_email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="example@domain.com"
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
                                />
                            </Form.Item>

                            <Form.Item
                                name="profile_address"
                                label="Địa chỉ"
                            >
                                <Input
                                    prefix={<HomeOutlined />}
                                    placeholder="Nhập địa chỉ"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Cập nhật thông tin
                        </Button>
                    </Form.Item>

                    <div className="modal-footer-info">
                        ℹ️ Cập nhật thông tin của bạn sẽ giúp chúng tôi phục vụ bạn tốt hơn.
                    </div>
                </Form>
            </Modal>

            <Modal
                title="Đổi mật khẩu"
                visible={passwordModalVisible}
                onCancel={() => setPasswordModalVisible(false)}
                footer={null}
                className="school-profile-modal password-change-modal"
                width={600}
                centered
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                    className="password-change-form"
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
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>

                    <div className="modal-footer-info">
                        🔒 Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt. Không bao gồm dấu chấm.
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default UserProfile;