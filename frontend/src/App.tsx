// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Import Outlet
import Login from './pages/Login';
import Register from './pages/Register'; // Import Register
import AddProduct from './pages/AddProduct';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Gunakan ProtectedRoute untuk membungkus halaman rahasia */}
        <Route element={<ProtectedRoute />}>
           <Route path="/add-product" element={<AddProduct />} />
           {/* Tambahkan rute lain yang butuh login di sini nanti */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;