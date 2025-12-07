// frontend/src/pages/AddProduct.tsx
import { useState } from 'react';
import api from '../api';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana sebelum kirim
    if (!file) {
      alert('Mohon pilih gambar produk!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', desc);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('file', file);

    try {
      // PERBAIKAN: Hapus parameter headers!
      // Axios akan otomatis mengatur boundary multipart/form-data
      await api.post('/products', formData);
      
      alert('Produk berhasil diupload!');
      // Reset form
      setName('');
      setDesc('');
      setPrice('');
      setStock('');
      setFile(null);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal upload produk';
      alert(`Error: ${msg}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-black">
      <h2 className="text-xl font-bold mb-4">Tambah Produk Baru</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          className="border p-2 rounded bg-white text-black" 
          placeholder="Nama Produk" 
          value={name}
          onChange={e => setName(e.target.value)} 
        />
        <textarea 
          className="border p-2 rounded bg-white text-black" 
          placeholder="Deskripsi" 
          value={desc}
          onChange={e => setDesc(e.target.value)} 
        />
        <input 
          className="border p-2 rounded bg-white text-black" 
          type="number" 
          placeholder="Harga" 
          value={price}
          onChange={e => setPrice(e.target.value)} 
        />
        <input 
          className="border p-2 rounded bg-white text-black" 
          type="number" 
          placeholder="Stok" 
          value={stock}
          onChange={e => setStock(e.target.value)} 
        />
        
        <div className="border p-2 rounded bg-gray-50">
          <label className="block mb-2 text-sm font-medium">Gambar Produk</label>
          <input 
            type="file" 
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
          />
        </div>

        {file && (
          <img 
            src={URL.createObjectURL(file)} 
            alt="Preview" 
            className="w-full h-40 object-cover rounded border"
          />
        )}

        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Upload Sekarang
        </button>
      </form>
    </div>
  );
}