import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, AlertCircle, Tag } from 'lucide-react';
import { FAQItem } from '../types';
import { CATEGORIES } from '../constants';

interface FAQModuleProps {
  faqs: FAQItem[];
}

const FAQModule: React.FC<FAQModuleProps> = ({ faqs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, selectedCategory]);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Helper for category colors
  const getCategoryColor = (cat: string) => {
    switch (cat) {
        case 'Pengisian SKP': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Masalah Teknis': return 'bg-red-100 text-red-700 border-red-200';
        case 'Penilaian': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'Akun & Jabatan': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'Regulasi': return 'bg-orange-100 text-orange-700 border-orange-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white p-0 md:p-2">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
          Knowledge Base (FAQ)
        </h2>
        
        {/* Search Bar */}
        <div className="relative mb-6 group">
          <input
            type="text"
            placeholder="Cari masalah (misal: atasan tidak muncul)..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 font-medium shadow-sm group-hover:shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search className="w-6 h-6" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white border-slate-800 shadow-lg transform scale-105'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-6 bg-slate-50/50 min-h-[300px]">
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div 
                key={faq.id} 
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${openId === faq.id ? 'bg-white border-indigo-200 shadow-md' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex justify-between items-start p-5 text-left"
                >
                  <div className="flex gap-4 items-start">
                      <div className={`mt-1 p-1.5 rounded-lg flex-shrink-0 ${openId === faq.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 border ${getCategoryColor(faq.category)}`}>
                            {faq.category}
                        </span>
                        <h3 className={`font-bold text-lg leading-tight ${openId === faq.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {faq.question}
                        </h3>
                      </div>
                  </div>
                  {openId === faq.id ? (
                    <div className="bg-indigo-50 p-1 rounded-full"><ChevronUp className="w-5 h-5 text-indigo-600" /></div>
                  ) : (
                    <div className="p-1"><ChevronDown className="w-5 h-5 text-slate-300" /></div>
                  )}
                </button>
                
                {openId === faq.id && (
                  <div className="px-5 pb-5 pl-[4.5rem]">
                    <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 text-slate-700 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <span>Dibaca {faq.views} kali</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-medium">Tidak ada hasil ditemukan untuk "{searchTerm}"</p>
              <p className="text-sm mt-1">Coba gunakan kata kunci lain.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQModule;