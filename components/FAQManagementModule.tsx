import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, BookOpen, CheckCircle } from 'lucide-react';
import { FAQItem } from '../types';
import { CATEGORIES } from '../constants';

interface FAQManagementModuleProps {
  currentFaqs: FAQItem[];
  onUpdate: (faqs: FAQItem[]) => void;
}

const FAQManagementModule: React.FC<FAQManagementModuleProps> = ({ currentFaqs, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: CATEGORIES[1] // Default to first real category
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEdit = (faq: FAQItem) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
    setEditId(faq.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      const updatedFaqs = currentFaqs.filter(f => f.id !== id);
      onUpdate(updatedFaqs);
      showNotification('FAQ berhasil dihapus.');
    }
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '', category: CATEGORIES[1] });
    setEditId(null);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question || !formData.answer) {
      alert('Pertanyaan dan Jawaban wajib diisi.');
      return;
    }

    if (editId) {
      // Update existing
      const updatedFaqs = currentFaqs.map(f => 
        f.id === editId 
          ? { ...f, ...formData } 
          : f
      );
      onUpdate(updatedFaqs);
      showNotification('FAQ berhasil diperbarui.');
    } else {
      // Create new
      const newFaq: FAQItem = {
        id: Date.now().toString(),
        ...formData,
        views: 0
      };
      onUpdate([newFaq, ...currentFaqs]);
      showNotification('FAQ baru berhasil ditambahkan.');
    }
    resetForm();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {notification && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-bounce">
          <CheckCircle className="w-5 h-5 mr-2" />
          {notification}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            {isEditing ? <Edit className="w-5 h-5 mr-2 text-orange-500" /> : <Plus className="w-5 h-5 mr-2 text-blue-600" />}
            {isEditing ? 'Edit Pertanyaan FAQ' : 'Tambah FAQ Baru'}
          </h2>
          {isEditing && (
            <button onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-800 flex items-center">
              <X className="w-4 h-4 mr-1" /> Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Pertanyaan</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                placeholder="Contoh: Bagaimana cara reset password?"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none bg-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jawaban / Solusi</label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
              placeholder="Tuliskan jawaban lengkap di sini..."
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className={`flex items-center px-6 py-2 rounded-lg font-bold text-white transition-colors ${
                isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Simpan Perubahan' : 'Simpan FAQ'}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
           <BookOpen className="w-5 h-5 mr-2 text-slate-500" />
           Daftar FAQ Aktif ({currentFaqs.length})
        </h3>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 w-1/4">Kategori & Pertanyaan</th>
                        <th className="px-4 py-3 w-1/2">Jawaban</th>
                        <th className="px-4 py-3 text-center w-20">Views</th>
                        <th className="px-4 py-3 text-right w-32">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {currentFaqs.map((faq) => (
                        <tr key={faq.id} className="hover:bg-slate-50 group transition-colors">
                            <td className="px-4 py-4 align-top">
                                <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase mb-1 border border-blue-100">
                                    {faq.category}
                                </span>
                                <p className="font-bold text-slate-800 leading-tight">{faq.question}</p>
                            </td>
                            <td className="px-4 py-4 align-top text-slate-600 leading-relaxed">
                                <p className="line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                    {faq.answer}
                                </p>
                            </td>
                            <td className="px-4 py-4 align-top text-center text-slate-400 font-mono text-xs">
                                {faq.views}
                            </td>
                            <td className="px-4 py-4 align-top text-right whitespace-nowrap">
                                <button 
                                    onClick={() => handleEdit(faq)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(faq.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {currentFaqs.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-slate-400 italic">
                                Belum ada data FAQ. Silakan tambahkan di atas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default FAQManagementModule;