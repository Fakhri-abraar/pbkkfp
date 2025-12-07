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
    
    // Gunakan FormData untuk kirim file + text
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', desc);
    formData.append('price', price);
    formData.append('stock', stock);
    if (file) {
      formData.append('file', file); // 'file' harus sesuai dengan @UseInterceptors(FileInterceptor('file')) di Backend
    }

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Produk berhasil diupload!');
    } catch (error) {
      console.error(error);
      alert('Gagal upload produk.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-black">
      <h2 className="text-xl font-bold mb-4">Tambah Produk Baru</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          className="border p-2 rounded bg-white text-black" 
          placeholder="Nama Produk" 
          onChange={e => setName(e.target.value)} 
        />
        <textarea 
          className="border p-2 rounded bg-white text-black" 
          placeholder="Deskripsi" 
          onChange={e => setDesc(e.target.value)} 
        />
        <input 
          className="border p-2 rounded bg-white text-black" 
          type="number" 
          placeholder="Harga" 
          onChange={e => setPrice(e.target.value)} 
        />
        <input 
          className="border p-2 rounded bg-white text-black" 
          type="number" 
          placeholder="Stok" 
          onChange={e => setStock(e.target.value)} 
        />
        
        {/* Input Gambar */}
        <div className="border p-2 rounded bg-gray-50">
          <label className="block mb-2 text-sm font-medium">Gambar Produk</label>
          <input 
            type="file" 
            onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
          />
        </div>

        {/* Preview Gambar Kecil */}
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