import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CogIcon,
  DocumentTextIcon,
  TicketIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navItems = [
    { path: '/admin/dashboard', icon: ChartBarIcon, label: 'Dashboard' },
    { path: '/admin/products', icon: ShoppingCartIcon, label: 'Products' },
    { path: '/admin/orders', icon: DocumentTextIcon, label: 'Orders' },
    { path: '/admin/users', icon: UsersIcon, label: 'Users' },
    { path: '/admin/coupons', icon: TicketIcon, label: 'Coupons' },
    { path: '/admin/settings', icon: CogIcon, label: 'Settings' },
  ];

  return (
    <div className={`
      bg-indigo-700 text-white h-screen fixed 
      ${isCollapsed ? 'w-20' : 'w-64'} 
      transition-all duration-300 ease-in-out 
      z-10 shadow-xl
    `}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-600">
        {!isCollapsed && (
          <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-indigo-600 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center 
                  ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3'} 
                  rounded-lg transition-colors
                  ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;