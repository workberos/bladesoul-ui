import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./assets/css/App.css";
import HomePage from './pages/HomePage/HomePage';
import NapTien from './pages/NapTien/NaptTien';
import HoTro from './pages/HoTro/HoTro';
import DangKy from './pages/DangKy/DangKy';
import Navbar from './components/navbar';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
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
