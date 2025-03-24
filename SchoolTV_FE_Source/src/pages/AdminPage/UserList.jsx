import './UserList.scss';
import { Layout, Menu, Table, Button, Input, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, UserDeleteOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';  
import { useState } from 'react';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;
const { Search } = Input;

const initialData = [
  { key: 1, name: 'Bảo Tín', title: 'Students', status: 'Active', role: 'User', email: 'Baitin@gmail.com', university: 'FPT University HCM' },
  { key: 2, name: 'Tấn Đông', title: 'Students', status: 'Reject', role: 'User', email: 'Tandong@gmail.com', university: 'FPT University HCM' },
  { key: 3, name: 'Thanh', title: 'Students', status: 'Pending', role: 'User', email: 'Thanh@gmail.com', university: 'FPT University HCM' },
  { key: 4, name: 'Lu Hào', title: 'Students', status: 'Inactive', role: 'User', email: 'LuHao@gmail.com', university: 'FPT University HCM' },
  { key: 5, name: 'Minh Phát', title: 'Students', status: 'Inactive', role: 'User', email: 'MinhPhat@gmail.com', university: 'FPT University HCM' },
  { key: 6, name: 'Sang', title: 'Students', status: 'Active', role: 'User', email: 'Sang@gmail.com', university: 'Đại học Bách Khoa HCM' },
];

const columns = [
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar',
    render: (_, record) => <Avatar size="large" icon={<UserOutlined />} />, 
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => <span>{text} <br /><span style={{ fontSize: '12px', color: 'gray' }}>{record.email}</span></span>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <span>{text}<br /><span style={{ fontSize: '12px', color: 'gray' }}>{record.university}</span></span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      if (!text) return null;

      let color = '';
      if (text === 'Active') color = 'green';
      if (text === 'Reject') color = 'red';
      if (text === 'Pending') color = 'blue';
      if (text === 'Inactive') color = 'gray';

      return <span style={{ color }}>{text}</span>;
    },
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Button type="link" onClick={() => handleEditStatus(record)}>Edit</Button> 
    ),
  },
];

function UserList() {
  const [data, setData] = useState(initialData); 
  const [editStatus, setEditStatus] = useState(null); 

  const navigate = useNavigate(); 
  const handleEditStatus = (record) => {
    setEditStatus(record);
  };

  const handleStatusChange = (newStatus) => {
    const updatedData = data.map((user) =>
      user.key === editStatus.key ? { ...user, status: newStatus } : user
    );
    setData(updatedData); 
    setEditStatus(null);  
  };

  const statusOptions = ['Active', 'Reject', 'Pending'];

  const statusButton = (status) => {
    let color = '';
    if (status === 'Active') color = 'green';
    if (status === 'Reject') color = 'red';
    if (status === 'Pending') color = 'blue';

    return (
      <Button 
        style={{ margin: '5px', backgroundColor: color, color: 'white' }} 
        onClick={() => handleStatusChange(status)}
      >
        {status}
      </Button>
    );
  };

  const handleSearch = (value) => {
    const filteredData = initialData.filter((user) => 
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);  
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken"); 
    sessionStorage.removeItem("userToken");

    navigate("/login");  
  };

  return (
    <div className="userlist-body">
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={225} className="site-layout-background">
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
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
            <Search
              placeholder="Search User"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={handleSearch}
              style={{ marginBottom: '20px', width: '300px' }}
            />
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5 }}
              rowKey="key"
            />

            {editStatus && (
              <div style={{ marginTop: 20 }}>
                <h3>Edit Status for {editStatus.name}</h3>
                <div>
                  {statusOptions.map(status => statusButton(status))}
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default UserList;
