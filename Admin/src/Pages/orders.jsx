// src/pages/admin/OrdersPage.jsx
import { useState, useEffect } from 'react';
import { 
  Table, Tag, Space, Button, Input, Select, Card, 
  Badge, Divider, Modal, Descriptions, message 
} from 'antd';
import { 
  SearchOutlined, EyeOutlined, 
  CheckCircleOutlined, CloseCircleOutlined 
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const Orders = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(
        `/api/admin/orders?page=${pagination.current}&limit=${pagination.pageSize}&status=${filters.status}&search=${filters.search}`
      );
      const data = await response.json();
      
      setOrders(data.orders);
      setPagination({
        ...pagination,
        total: data.totalCount,
      });
    } catch (error) {
      message.error('Failed to fetch orders');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, filters]);

  // Table columns configuration
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <span className="font-mono">#{text}</span>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <div>
          <div className="font-medium">{customer.name}</div>
          <div className="text-gray-500 text-sm">{customer.email}</div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => (
        <span className="font-semibold">${amount.toFixed(2)}</span>
      ),
      align: 'right',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { color: 'orange', text: 'Pending' },
          processing: { color: 'blue', text: 'Processing' },
          shipped: { color: 'geekblue', text: 'Shipped' },
          delivered: { color: 'green', text: 'Delivered' },
          cancelled: { color: 'red', text: 'Cancelled' },
        };
        
        return (
          <Tag color={statusMap[status]?.color || 'default'}>
            {statusMap[status]?.text || status}
          </Tag>
        );
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => showOrderDetails(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <Button
              type="primary"
              onClick={() => updateOrderStatus(record.orderId, 'processing')}
            >
              Process
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Show order details modal
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`localhost:4000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        message.success('Order status updated successfully');
        fetchOrders(); // Refresh the orders list
      } else {
        message.error('Failed to update order status');
      }
    } catch (error) {
      message.error('Error updating order status');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle table pagination change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Handle search
  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
    setPagination({ ...pagination, current: 1 });
  };

  // Handle status filter change
  const handleStatusChange = (value) => {
    setFilters({ ...filters, status: value });
    setPagination({ ...pagination, current: 1 });
  };

  return (
    <div className="p-4">
      <Card
        title="Order Management"
        extra={
          <div className="flex space-x-4">
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 200 }}
              onChange={handleStatusChange}
            >
              <Option value="pending">Pending</Option>
              <Option value="processing">Processing</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
            
            <Search
              placeholder="Search orders..."
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 300 }}
              onSearch={handleSearch}
            />
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Order #${selectedOrder?.orderId}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Customer Name">{selectedOrder.customer.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.customer.email}</Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  selectedOrder.status === 'delivered' ? 'green' : 
                  selectedOrder.status === 'cancelled' ? 'red' : 'blue'
                }>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address" span={2}>
                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, 
                {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}, 
                {selectedOrder.shippingAddress.country}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Order Items</Divider>
            
            <Table
              dataSource={selectedOrder.items}
              rowKey="productId"
              pagination={false}
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <div className="flex items-center">
                      <img 
                        src={record.image} 
                        alt={text} 
                        className="w-10 h-10 object-cover mr-3"
                      />
                      <span>{text}</span>
                    </div>
                  ),
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `$${price.toFixed(2)}`,
                  align: 'right',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  align: 'center',
                },
                {
                  title: 'Total',
                  key: 'total',
                  render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
                  align: 'right',
                },
              ]}
            />

            <Divider />

            <div className="flex justify-end">
              <div className="text-right">
                <div className="mb-2">
                  <span className="mr-4">Subtotal:</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="mb-2">
                  <span className="mr-4">Shipping:</span>
                  <span>${selectedOrder.shippingFee.toFixed(2)}</span>
                </div>
                <div className="mb-2">
                  <span className="mr-4">Tax:</span>
                  <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                </div>
                <div className="text-lg font-bold">
                  <span className="mr-4">Total:</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex justify-end space-x-4 mt-4">
              {selectedOrder.status === 'pending' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.orderId, 'processing');
                      setIsModalVisible(false);
                    }}
                  >
                    Process Order
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.orderId, 'cancelled');
                      setIsModalVisible(false);
                    }}
                  >
                    Cancel Order
                  </Button>
                </>
              )}
              {selectedOrder.status === 'processing' && (
                <Button
                  type="primary"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.orderId, 'shipped');
                    setIsModalVisible(false);
                  }}
                >
                  Mark as Shipped
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;