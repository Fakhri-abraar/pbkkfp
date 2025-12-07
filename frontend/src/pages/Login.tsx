// frontend/src/pages/Login.tsx
import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      // Simpan token di LocalStorage
      localStorage.setItem('token', res.data.access_token);
      alert('Login Berhasil!');
      navigate('/add-product'); // Langsung arahkan ke halaman upload
    } catch (error) {
      alert('Login Gagal! Cek email/password.');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl mb-4 font-bold text-center text-black">Login Seller</h1>
        <input 
          className="w-full border p-2 mb-4 rounded text-black bg-white" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          className="w-full border p-2 mb-4 rounded text-black bg-white" 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar disini</Link>
          </p>
      </form>
    </div>
  );
}