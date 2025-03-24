import './SchoolOwner.scss';
import { Layout, Menu, Table, Button, Input, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, UserDeleteOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;
const { Search } = Input;

const initialData = [
  { key: 1, name: 'FPT University', status: 'Active', role: 'School Owner', email: 'contact@fpt.edu.vn', university: 'FPT University' },
  { key: 2, name: 'Hanoi University of Science and Technology', status: 'Active', role: 'School Owner', email: 'contact@hust.edu.vn', university: 'Hanoi University of Science and Technology' },
  { key: 3, name: 'University of Danang', status: 'Inactive', role: 'School Owner', email: 'contact@ud.edu.vn', university: 'University of Danang' },
  { key: 4, name: 'University of Danang – University of Science', status: 'Reject', role: 'School Owner', email: 'contact@science.udn.vn', university: 'University of Danang – University of Science' },
  { key: 5, name: 'University of Economics Ho Chi Minh City', status: 'Pending', role: 'School Owner', email: 'contact@ueh.edu.vn', university: 'University of Economics Ho Chi Minh City' },
  { key: 6, name: 'Hanoi University of Foreign Studies', status: 'Active', role: 'School Owner', email: 'contact@hufs.edu.vn', university: 'Hanoi University of Foreign Studies' },
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
    render: () => <span>School Owner</span>,  
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

function SchoolOwner() {
  const [data, setData] = useState(initialData); 
  const [editStatus, setEditStatus] = useState(null); 

  const navigate = useNavigate(); 
  const handleEditStatus = (record) => {
    setEditStatus(record); 
  };

  const handleStatusChange = (newStatus) => {
    const updatedData = data.map((school) =>
      school.key === editStatus.key ? { ...school, status: newStatus } : school
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
    const filteredData = initialData.filter((school) => 
      school.name.toLowerCase().includes(value.toLowerCase()) ||
      school.email.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData); 
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");  
    sessionStorage.removeItem("userToken"); 

    navigate("/login"); 
  };

  return (
    <div className="schoolowner-body">
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
              placeholder="Search School"
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

export default SchoolOwner;
