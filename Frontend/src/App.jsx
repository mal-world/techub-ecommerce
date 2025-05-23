import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import LaptopPage from './Pages/LaptopPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/laptop' element={<LaptopPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}