import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./assets/css/App.css";
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage/HomePage';
import NapTien from './pages/NapTien/NaptTien';
import HoTro from './pages/HoTro/HoTro';
import DangKy from './pages/DangKy/DangKy';
import DangNhap from './pages/DangNhap/DangNhap';
import Navbar from './components/NavBar';
import CustomCursor from './components/cursor/CustomCursor';
import IntroScreen from './components/nitro/nitro-effect';

function App() {
  return (
    <Router>
      <IntroScreen />
      <CustomCursor />
      <div className="app">
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          style={{ marginTop: '70px' }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dang-nhap" element={<DangNhap />} />
          <Route path="/nap-tien" element={<NapTien />} />
          <Route path="/ho-tro" element={<HoTro />} />
          <Route path="/dang-ky" element={<DangKy />} />
          {/* <Route path="/tai-khoan" element={< />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App
