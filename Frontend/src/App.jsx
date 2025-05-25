import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from './Pages/MainPage';
import LaptopPage from './Pages/LaptopPage';
import DesktopPage from './Pages/DesktopPage';
import MonitorPage from './Pages/MonitorPage';
import AboutPage from './Pages/AboutPage';
import LogInPage from './Pages/Login';
import CartPage from './Pages/CartPage.jsX';
import CheckoutPage from './Pages/CheckoutPage';
import LayoutNavbar from './Components/LayoutNavbar';
import ProductDetails from './Pages/ProductDetails';
import GearPage from './Pages/GearPage';
import ProfilePage from './Pages/ProfilePage';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <> 
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route element={<LayoutNavbar />}>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/laptop' element={<LaptopPage/>}/>
            <Route path='/desktop' element={<DesktopPage/>}/> {/* Fixed typo: 'desktop' instead of 'desktop' */}
            <Route path='/monitor' element={<MonitorPage/>}/>
            <Route path='/gear' element={<GearPage/>}/>
            <Route path='/about' element={<AboutPage/>}/>
            <Route path='/products/:productId' element={<ProductDetails />}/>
          </Route>

          <Route path='/login' element={<LogInPage/>}/>
          <Route path='/cart' element={<CartPage/>}/>
          <Route path='/checkout' element={<CheckoutPage/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
        </Routes>
      </UserProvider>
    </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    
    </>
  );
}