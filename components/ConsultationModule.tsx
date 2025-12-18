import React, { useState } from 'react';
import { Send, Upload, User, FileText, Check, History, Printer, Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { UserProfile, TicketStatus } from '../types';
import { MOCK_TICKETS } from '../constants';

interface ConsultationModuleProps {
  user: UserProfile;
}

const ConsultationModule: React.FC<ConsultationModuleProps> = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'history'>('form');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nip: user.nip || '',
    name: user.name || '',
    unit: user.unitKerja || '',
    issueType: 'Teknis',
    description: ''
  });
  
  // State for accordion in history
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  const handlePrintTicket = (ticketId: string) => {
    // Only print specific content by leveraging CSS hide logic or simple window print for MVP
    window.print();
  };

  // Filter tickets for current user (Mock Data Matching)
  const myTickets = MOCK_TICKETS.filter(t => t.nip === user.nip);

  const StatusBadge = ({ status }: { status: TicketStatus }) => {
    switch (status) {
        case 'pending':
            return (
                <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                    <Clock className="w-3 h-3 mr-1" /> Menunggu
                </span>
            );
        case 'processing':
            return (
                <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Diproses
                </span>
            );
        case 'resolved':
            return (
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" /> Selesai
                </span>
            );
        default:
            return null;
    }
  };

  const renderForm = () => {
    if (submitted) {
      return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Tiket Terkirim!</h2>
          <p className="text-slate-600 mb-6">
            Laporan Anda telah masuk ke sistem. Anda dapat memantau progres penyelesaian pada menu <strong>Riwayat Laporan</strong>.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => { setSubmitted(false); setFormData({ nip: user.nip, name: user.name, unit: user.unitKerja || '', issueType: 'Teknis', description: '' }); }}
              className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Buat Baru
            </button>
            <button 
              onClick={() => setActiveSubTab('history')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Riwayat
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Formulir Konsultasi Baru
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIP / NIK</label>
              <div className="relative">
                <input
                  type="text"
                  name="nip"
                  readOnly
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none cursor-not-allowed"
                  value={formData.nip}
                />
                <User className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none cursor-not-allowed"
                value={formData.name}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Unit Kerja</label>
            <input
              type="text"
              name="unit"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
              placeholder="Dinas/Badan/Biro..."
              value={formData.unit}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Masalah</label>
            <select
              name="issueType"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none bg-white"
              value={formData.issueType}
              onChange={handleChange}
            >
              <option value="Teknis">Kendala Teknis Aplikasi</option>
              <option value="Substansi">Penyusunan SKP / RHK</option>
              <option value="Penilaian">Penilaian & Banding</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Masalah</label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none"
              placeholder="Jelaskan detail masalah Anda..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Screenshot (Opsional)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Klik untuk upload gambar error</p>
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all"
          >
            <Send className="w-5 h-5 mr-2" />
            Kirim Laporan
          </button>
        </form>
      </div>
    );
  };

  const renderHistory = () => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-fade-in">
         <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <History className="w-5 h-5 mr-2 text-blue-600" />
          Riwayat Laporan Saya
        </h2>

        <div className="space-y-4">
          {myTickets.length > 0 ? (
            myTickets.map((ticket) => (
              <div key={ticket.id} className="border border-slate-200 rounded-lg overflow-hidden break-inside-avoid print:break-inside-avoid print:border-black print:mb-4">
                {/* Header Ticket */}
                <div 
                    onClick={() => setOpenTicketId(openTicketId === ticket.id ? null : ticket.id)}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors print:bg-white print:border-b"
                >
                    <div className="mb-2 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-slate-500 bg-white border border-slate-200 px-1.5 rounded print:text-black print:border-black">
                                {ticket.id}
                            </span>
                            <span className="text-xs text-slate-500">{ticket.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-800">{ticket.category}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                         <StatusBadge status={ticket.status} />
                         {openTicketId === ticket.id ? <ChevronUp className="w-5 h-5 text-slate-400 print:hidden" /> : <ChevronDown className="w-5 h-5 text-slate-400 print:hidden" />}
                    </div>
                </div>

                {/* Detail Ticket */}
                {(openTicketId === ticket.id || window.matchMedia('print').matches) && (
                    <div className="p-5 bg-white border-t border-slate-200 print:block">
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Pertanyaan / Masalah:</h4>
                            <p className="text-slate-800 bg-slate-50 p-3 rounded border border-slate-100 print:bg-transparent print:border-none print:p-0">
                                {ticket.question}
                            </p>
                        </div>

                        {ticket.answer && (
                            <div className="mb-4 animate-fade-in">
                                <h4 className="text-xs font-bold text-green-600 uppercase mb-1 flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Jawaban / Solusi:
                                </h4>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-slate-800 print:bg-transparent print:border-none print:p-0">
                                    {ticket.answer}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-2 border-t border-slate-100 print:hidden">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handlePrintTicket(ticket.id); }}
                                className="flex items-center text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                <Printer className="w-4 h-4 mr-1.5" />
                                Cetak Tiket
                            </button>
                        </div>
                    </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <p className="text-slate-500 mb-2">Belum ada riwayat laporan.</p>
                <button onClick={() => setActiveSubTab('form')} className="text-blue-600 font-bold hover:underline">
                    Buat Laporan Sekarang
                </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content Area */}
      <div className="lg:col-span-2">
        {/* Sub Navigation */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-100 mb-6 w-fit print:hidden">
            <button
                onClick={() => setActiveSubTab('form')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    activeSubTab === 'form' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
                Buat Laporan Baru
            </button>
            <button
                 onClick={() => setActiveSubTab('history')}
                 className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    activeSubTab === 'history' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
            >
                Riwayat Laporan Saya
                {myTickets.length > 0 && (
                    <span className="ml-2 bg-white/20 px-1.5 rounded-full text-xs">
                        {myTickets.length}
                    </span>
                )}
            </button>
        </div>

        {activeSubTab === 'form' ? renderForm() : renderHistory()}
      </div>

      {/* Info Sidebar (Hidden on Print) */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 h-fit print:hidden">
        <h3 className="font-bold text-blue-900 mb-4">Informasi Layanan</h3>
        <ul className="space-y-4 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
            Layanan helpdesk beroperasi pada hari kerja Senin-Jumat, pukul 08.00 - 16.00 WIB.
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
            Pantau status laporan Anda secara berkala pada tab "Riwayat Laporan".
          </li>
          <li className="flex items-start">
            <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
            Jika status "Selesai", Anda dapat mencetak tiket sebagai bukti penyelesaian masalah.
          </li>
        </ul>
      </div>

      {/* Print Overlay Title (Only visible when printing) */}
      <div className="hidden print:block fixed top-0 left-0 w-full text-center p-4">
        <h1 className="text-2xl font-bold mb-2">Detail Tiket Konsultasi SKP</h1>
        <p className="text-sm">Dicetak oleh: {user.name} ({user.nip})</p>
        <p className="text-sm text-slate-500">{new Date().toLocaleDateString('id-ID')}</p>
      </div>
    </div>
  );
};

export default ConsultationModule;