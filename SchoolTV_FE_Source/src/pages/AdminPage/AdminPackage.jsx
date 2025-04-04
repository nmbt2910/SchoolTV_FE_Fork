import { Layout, Table, Button, Form, Input, InputNumber, Select, Modal } from 'antd';
import Sider from 'antd/es/layout/Sider';
import AdminMenu from './AdminMenu';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AdminPackage.scss';
import apiFetch from '../../config/baseAPI';

const { Search } = Input;

function AdminPackage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); 
  const [packageToDelete, setPackageToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    apiFetch("/api/Package", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received from API:", data);
        setPackages(data.$values);
        setFilteredPackages(data.$values); 
      })
      .catch((error) => console.error("Error fetching packages:", error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleEditClick = (packageData) => {
    setSelectedPackage(packageData);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (packageData) => {
    setPackageToDelete(packageData); 
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    const token = localStorage.getItem("authToken");

    apiFetch(`/api/Package/${packageToDelete.packageID}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (response.ok) {
          setIsDeleteModalVisible(false);
          setPackageToDelete(null);
          apiFetch("/api/Package", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
            .then((response) => response.json())
            .then((data) => {
              setPackages(data.$values);
              setFilteredPackages(data.$values); 
            })
            .catch((error) => console.error("Error fetching packages:", error));
        } else {
          console.error("Error deleting package:", response);
        }
      })
      .catch((error) => console.error("Error deleting package:", error));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (value.trim() === '') {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPackages(filtered);
    }
  };

  const handleUpdate = (values) => {
    const token = localStorage.getItem("authToken");
    const currentDate = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.packageID === selectedPackage.packageID ? {
          ...pkg,
          name: values.name,
          description: values.description,
          price: values.price,
          duration: values.duration,
          status: values.status === "Active",
          updatedAt: currentDate
        } : pkg
      )
    );

    setFilteredPackages(prevFilteredPackages =>
      prevFilteredPackages.map(pkg =>
        pkg.packageID === selectedPackage.packageID ? {
          ...pkg,
          name: values.name,
          description: values.description,
          price: values.price,
          duration: values.duration,
          status: values.status === "Active",
          updatedAt: currentDate
        } : pkg
      )
    );
  
    apiFetch(`/api/Package/${selectedPackage.packageID}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        price: values.price,
        duration: values.duration,
        status: values.status === "Active",
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        if (response.status === 204) {
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log('Package updated successfully', data);
        }
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Error updating package:", error);
      });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? 'Active' : 'Inactive'),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => {
        const date = new Date(text);
        date.setHours(date.getHours() + 7);
        return date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
      },
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => {
        const date = new Date(text);
        date.setHours(date.getHours() + 7);
        return date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button onClick={() => handleEditClick(record)}>Edit</Button>
          <Button
            type="danger"
            onClick={() => handleDeleteClick(record)}
            style={{ marginLeft: 10, backgroundColor: 'red', color: 'white', borderColor: 'red' , width: '55px'}}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='adminpackage_body'>
      <Layout style={{ minHeight: '90vh' }}>
        <Sider>
          <AdminMenu onLogout={handleLogout} />
        </Sider>
        <Layout.Content style={{ padding: '20px' }}>
          {/* Search Input */}
          <Search
            placeholder="Search by Name"
            onChange={handleSearchChange} 
            style={{ width: 300, marginBottom: 20 }}
          />
          <Table
            dataSource={filteredPackages}
            columns={columns}
            rowKey="packageID"
          />
        </Layout.Content>
      </Layout>

      <Modal
        title="Edit Package"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedPackage && (
          <Form
            initialValues={{
              name: selectedPackage.name,
              description: selectedPackage.description,
              price: selectedPackage.price,
              duration: selectedPackage.duration,
              status: selectedPackage.status ? 'Active' : 'Inactive',
            }}
            onFinish={handleUpdate}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input package name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please input package description!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please input package price!' }]}
            >
              <InputNumber min={0.01} step={0.01} />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: 'Please input package duration!' }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select package status!' }]}
            >
              <Select>
                <Select.Option value="Active">Active</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalVisible(false)} 
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this package?</p>
      </Modal>
    </div>
  );
}

export default AdminPackage;
