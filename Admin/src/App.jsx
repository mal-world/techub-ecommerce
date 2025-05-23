import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/login.jsx';
import Dashboard from './Pages/dashboard.jsx';
import Users from './Pages/users.jsx';
import Product from './Pages/products.jsx';
import Orders from './Pages/orders.jsx';
import Welcome from './Pages/welcome.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/user/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/products" element={<Product />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}
