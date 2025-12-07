// frontend/src/pages/Register.tsx
import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SELLER'); // Default role
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        role 
      });
      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Registrasi Gagal');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form onSubmit={handleRegister} className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl mb-6 font-bold text-center text-blue-600">Register Akun</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
          <input 
            className="w-full border p-2 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            placeholder="Contoh: Budi Seller" 
            value={name} 
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            className="w-full border p-2 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            type="email"
            placeholder="email@contoh.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            className="w-full border p-2 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            type="password" 
            placeholder="Minimal 6 karakter" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Tipe Akun</label>
          <select 
            className="w-full border p-2 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="SELLER">Seller (Penjual)</option>
            <option value="CUSTOMER">Customer (Pembeli)</option>
          </select>
        </div>

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200">
          Daftar Sekarang
        </button>

        <p className="mt-4 text-center text-sm">
          Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login disini</Link>
        </p>
      </form>
    </div>
  );
}