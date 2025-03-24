import './AdminPage.scss';
import { Layout, Menu, Card, Row, Col } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, UserDeleteOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';  

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

const data = [
  { month: 'Jan', users: 4000, revenue: 2400 },
  { month: 'Feb', users: 3000, revenue: 2210 },
  { month: 'Mar', users: 2000, revenue: 2290 },
  { month: 'Apr', users: 2780, revenue: 2000 },
  { month: 'May', users: 1890, revenue: 2181 },
  { month: 'Jun', users: 2390, revenue: 2500 },
  { month: 'Jul', users: 3490, revenue: 2100 },
];

function AdminPage() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("userToken"); 
    sessionStorage.removeItem("userToken"); 

    navigate("/login");  
  };

  return (
    <div className="admin_body">
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={225} className="site-layout-background">
          <Menu theme='dark' mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
            <Menu.Item key="1" icon={<HomeOutlined />}><Link to="/adminpage">Dashboard</Link></Menu.Item>
            <Menu.Item key="2" icon={<SettingOutlined />}>Account Settings</Menu.Item>
            <SubMenu key="3" icon={<UserOutlined />} title="User Management">
              <Menu.Item key="3.1" icon={<UserDeleteOutlined />}><Link to="/userlist">User List</Link></Menu.Item>
              <Menu.Item key="3.2" icon={<UsergroupDeleteOutlined />}><Link to="/schoolowner">School Owners</Link></Menu.Item>
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
                  <div>45,640</div>
                  <div>Increased by 0.5%</div>
                </Card>
              </Col>
              <Col span={7}>
                <Card title="School Owners" bordered={false}>
                  <div>93</div>
                  <div>Increased 0.002%</div>
                </Card>
              </Col>
            </Row>

            {/* Chart Layout */}
            <div style={{ marginTop: 200 }}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default AdminPage;
