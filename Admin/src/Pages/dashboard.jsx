import { useState, useEffect } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CogIcon,
  DocumentTextIcon,
  TicketIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {

  const navigate = useNavigate();
  // State management
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
      if (!mobile) setIsMobileOpen(false);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Toggle handlers
  const toggleSidebar = () => {
    if (isMobileView) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Sample data
  const stats = [
    { title: 'Total Revenue', value: '$12,345', change: '+12%', icon: CurrencyDollarIcon, trend: 'up' },
    { title: 'New Orders', value: '56', change: '+5%', icon: ShoppingCartIcon, trend: 'up' },
    { title: 'Active Users', value: '892', change: '-2%', icon: UsersIcon, trend: 'down' },
    { title: 'Avg. Response', value: '32m', change: '+8%', icon: ClockIcon, trend: 'up' }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Alex Johnson', amount: '$125.99', status: 'Delivered' },
    { id: '#ORD-002', customer: 'Maria Garcia', amount: '$89.50', status: 'Shipped' },
    { id: '#ORD-003', customer: 'James Wilson', amount: '$234.00', status: 'Processing' },
    { id: '#ORD-004', customer: 'Sarah Lee', amount: '$56.75', status: 'Cancelled' }
  ];

  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 2780 },
    { month: 'May', sales: 1890 },
    { month: 'Jun', sales: 2390 }
  ];

  // Nav items
  const navItems = [
    { path: '/admin/dashboard', icon: ChartBarIcon, label: 'Dashboard' },
    { path: '/admin/products', icon: ShoppingCartIcon, label: 'Products' },
    { path: '/admin/orders', icon: DocumentTextIcon, label: 'Orders' },
    { path: '/admin/users', icon: UsersIcon, label: 'Users' },
    { path: '/admin/coupons', icon: TicketIcon, label: 'Coupons' },
    { path: '/admin/settings', icon: CogIcon, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Hamburger Button */}
      {isMobileView && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-20 p-2 rounded-md bg-indigo-600 text-white lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && isMobileView && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-indigo-700 text-white h-screen fixed
          ${isMobileView ? (isMobileOpen ? 'left-0' : '-left-full') : 'left-0'}
          ${isCollapsed && !isMobileView ? 'w-20' : 'w-64'}
          transition-all duration-300 ease-in-out
          z-40 shadow-xl
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-600 h-16">
          {(!isCollapsed || isMobileView) && (
            <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-indigo-600 transition-colors"
          >
            {isMobileView ? (
              <XMarkIcon className="h-5 w-5" />
            ) : isCollapsed ? (
              <ChevronDoubleRightIcon className="h-5 w-5" />
            ) : (
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <ul className="space-y-1 px-2 pb-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => isMobileView && setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center 
                    ${(isCollapsed && !isMobileView) ? 'justify-center py-4' : 'px-4 py-3'} 
                    rounded-lg transition-colors
                    ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {(!isCollapsed || isMobileView) && (
                    <span className="ml-3 whitespace-nowrap">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-300 ease-in-out
          ${isMobileView ? 'ml-0' : isCollapsed ? 'ml-20' : 'ml-64'}
        `}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                <BellIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <img 
                  className="h-8 w-8 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Admin" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpIcon className="-ml-0.5 mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="-ml-0.5 mr-1 h-3 w-3 text-red-500" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingCartIcon className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Add Product</span>
              </button>
              <button onClick={() => navigate('/admin/users')} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UsersIcon className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Manage Users</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">View Reports</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <TicketIcon className="h-8 w-8 text-yellow-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Create Coupon</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;