import { useState, useEffect } from 'react';
import './AdminPage.scss';
import { Layout, Menu, Card, Row, Col } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, UserDeleteOutlined, UsergroupDeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

function AdminPage() {
  const [schoolOwnerCount, setSchoolOwnerCount] = useState(0); 
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("authToken"); 
        const response = await axios.get('https://localhost:7057/api/accounts/admin/statistics/signup-count', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setRegisteredUsersCount(response.data.userCount);
        setSchoolOwnerCount(response.data.schoolOwnerCount);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê: ", error);
      }
    };    

    fetchStatistics();
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");

    navigate("/login");
  };

  return (
    <div className="admin_body">
      <Layout style={{ minHeight: '90vh' }}>
        <Sider width={225} className="site-layout-background">
        <Menu theme='dark' mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
            <Menu.Item key="1" icon={<UnorderedListOutlined />}><Link to="/adminpage">Dashboard</Link></Menu.Item>
            <Menu.Item key="2" icon={<SettingOutlined />}><Link to="/sopending">School Owner Pending</Link></Menu.Item>
            <SubMenu key="3" icon={<UserOutlined />} title="User Management">
              <Menu.Item key="3.1" icon={<UserDeleteOutlined />}><Link to="/userlist">User List</Link></Menu.Item>
              <Menu.Item key="3.2" icon={<UsergroupDeleteOutlined />}><Link to="/adminlist">Admin List</Link></Menu.Item>
              <Menu.Item key="3.3" icon={<HomeOutlined />}><Link to="/soaccount">School Owner Account</Link></Menu.Item>
            </SubMenu>
            <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>Log out</Menu.Item>
          </Menu>
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
