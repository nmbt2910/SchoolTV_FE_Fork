import './Createpackage.scss';
import apiFetch from '../../config/baseAPI'; 
import { Layout, Form, Input, Button, message } from 'antd';
import Sider from 'antd/es/layout/Sider';
import AdminMenu from './AdminMenu';
import { useNavigate } from 'react-router-dom';

function CreatePackage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleCreate = async (values) => {
    const token = localStorage.getItem("authToken");
    
    try {
      const response = await apiFetch("/api/Package", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Package created successfully!");
        form.resetFields();
      } else {
        throw new Error("Error creating package");
      }
    } catch (error) {
      message.error("Failed to create package: " + error.message);
    }
  };

  return (
    <div className='create-package-body'>
      <Layout style={{ minHeight: '90vh' }}>
        <Sider width={225}>
          <AdminMenu onLogout={handleLogout} />
        </Sider>
        <Layout.Content style={{ padding: '20px' }}>
          <h2>Create Package</h2>
          <Form
            form={form}
            onFinish={handleCreate}
            layout="vertical"
            initialValues={{
              name: '',
              description: '',
              price: 0.01,
              duration: 0,
              status: true,
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input package name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input package description!' }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input package price!' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Duration (days)"
              name="duration"
              rules={[{ required: true, message: 'Please input package duration!' }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Package
              </Button>
            </Form.Item>
          </Form>
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default CreatePackage;
