import { useState, useEffect } from 'react';
import './AdminPage.scss';
import { Layout, Menu, Card, Row, Col } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, UserDeleteOutlined, UsergroupDeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import apiFetch from '../../config/baseAPI';

const { Sider, Content } = Layout;

function AdminPage() {
  const [schoolOwnerCount, setSchoolOwnerCount] = useState(0);
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const headers = {
          'accept': '*/*'
        };

        const response = await apiFetch('accounts/admin/statistics/signup-count', { headers });

        if (!response.ok) {
          throw new Error(`Failed to fetch statistics: ${response.status}`);
        }

        const data = await response.json();
        setRegisteredUsersCount(data.userCount);
        setSchoolOwnerCount(data.schoolOwnerCount);
      } catch (error) {
        console.error("Error fetching statistics: ", error);
        if (error.message.includes('Failed to fetch statistics')) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    };

    fetchStatistics();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="admin_body">
      <Layout style={{ minHeight: '90vh' }}>
        <Sider width={225} className="site-layout-background">
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={[
            {
              key: '1',
              icon: <UnorderedListOutlined />,
              label: <Link to="/adminpage">Dashboard</Link>,
            },
            {
              key: '2',
              icon: <SettingOutlined />,
              label: <Link to="/sopending">School Owner Pending</Link>,
            },
            {
              key: '3',
              icon: <UserOutlined />,
              label: "User Management",
              children: [
                {
                  key: '3.1',
                  icon: <UserDeleteOutlined />,
                  label: <Link to="/userlist">User List</Link>,
                },
                {
                  key: '3.2',
                  icon: <UsergroupDeleteOutlined />,
                  label: <Link to="/adminlist">Admin List</Link>,
                },
                {
                  key: '3.3',
                  icon: <HomeOutlined />,
                  label: <Link to="/soaccount">School Owner Account</Link>,
                },
              ],
            },
            {
              key: '4',
              icon: <LogoutOutlined />,
              label: 'Log out',
              onClick: handleLogout,
            },
          ]} />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Row gutter={16} justify="space-between">
              <Col span={7}>
                <Card title="Monthly Revenue" bordered={false}>
                  <div>$ 23,323,000</div>
                  <div>Increased by 60%</div>
                </Card>
              </Col>
              <Col span={7}>
                <Card title="Number of Registered Users" bordered={false}>
                  <div>{registeredUsersCount}</div>
                  <div>Increased by 0.5%</div>
                </Card>
              </Col>
              <Col span={7}>
                <Card title="School Owners Active" bordered={false}>
                  <div>{schoolOwnerCount}</div>
                  <div>Increased 0.002%</div>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default AdminPage;