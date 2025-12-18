import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Copy, Check, BarChart3, MessageSquare, Users, FileQuestion, Printer, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { STATS_ISSUE_TYPE, STATS_MONTHLY, STAFF_TEMPLATES, MOCK_TICKETS } from '../constants';
import { TicketStatus } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StaffDashboard: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const StatusBadge = ({ status }: { status: TicketStatus }) => {
    switch (status) {
        case 'pending':
            return (
                <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 w-fit">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-bold uppercase">Belum Diproses</span>
                </div>
            );
        case 'processing':
            return (
                <div className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200 w-fit">
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-bold uppercase">Sedang Diproses</span>
                </div>
            );
        case 'resolved':
            return (
                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 w-fit">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    <span className="text-xs font-bold uppercase">Selesai</span>
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* KPI Cards (Hidden on Print) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">Total Tiket Masuk</p>
                        <h3 className="text-2xl font-bold text-slate-800">1,240</h3>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">Pengguna Aktif</p>
                        <h3 className="text-2xl font-bold text-slate-800">856</h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">Masalah Selesai</p>
                        <h3 className="text-2xl font-bold text-slate-800">92%</h3>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Check className="w-6 h-6" />
                    </div>
                </div>
            </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm">FAQ Dibaca</p>
                        <h3 className="text-2xl font-bold text-slate-800">3.5k</h3>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                        <FileQuestion className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>

      {/* Stats Section (Hidden on Print) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Statistik Jenis Masalah
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATS_ISSUE_TYPE}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {STATS_ISSUE_TYPE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
             <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
             Tren Konsultasi Bulanan
          </h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATS_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ticket Recap Table (The main focus for printing) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
         <div className="flex justify-between items-center mb-6 print:hidden">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <FileQuestion className="w-6 h-6 mr-2 text-blue-600" />
                Rekapitulasi Tiket & Tanya Jawab
            </h3>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
                <Printer className="w-4 h-4" /> Cetak Laporan
            </button>
         </div>

         {/* Print Header */}
         <div className="hidden print:block mb-8 text-center border-b pb-4">
            <h1 className="text-2xl font-bold uppercase">Laporan Rekapitulasi Pengaduan SKP</h1>
            <p className="text-sm text-slate-500">Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-slate-200">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs print:bg-slate-200">
                    <tr>
                        <th className="px-4 py-3 border-b border-slate-200">ID / Tanggal</th>
                        <th className="px-4 py-3 border-b border-slate-200">Pelapor</th>
                        <th className="px-4 py-3 border-b border-slate-200 w-1/3">Pertanyaan & Masalah</th>
                        <th className="px-4 py-3 border-b border-slate-200 w-1/3">Jawaban / Tindak Lanjut</th>
                        <th className="px-4 py-3 border-b border-slate-200 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-b border-slate-200">
                    {MOCK_TICKETS.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-slate-50 print:hover:bg-transparent break-inside-avoid">
                            <td className="px-4 py-3 align-top">
                                <span className="font-mono font-bold block text-blue-600 print:text-black">{ticket.id}</span>
                                <span className="text-slate-500 text-xs">{ticket.date}</span>
                            </td>
                            <td className="px-4 py-3 align-top">
                                <p className="font-bold text-slate-800">{ticket.name}</p>
                                <p className="text-xs text-slate-500 font-mono">{ticket.nip}</p>
                                <p className="text-xs text-slate-500">{ticket.unit}</p>
                            </td>
                            <td className="px-4 py-3 align-top">
                                <span className="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-wider">{ticket.category}</span>
                                <p className="text-slate-700 italic">"{ticket.question}"</p>
                            </td>
                            <td className="px-4 py-3 align-top">
                                {ticket.answer ? (
                                    <p className="text-slate-700">{ticket.answer}</p>
                                ) : (
                                    <p className="text-slate-400 italic text-xs">- Belum ada jawaban -</p>
                                )}
                            </td>
                            <td className="px-4 py-3 align-top text-center">
                                <div className="flex justify-center">
                                    <StatusBadge status={ticket.status} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>

      {/* Templates Section (Hidden on Print) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 print:hidden">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
          Template Jawaban Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STAFF_TEMPLATES.map((template) => (
            <div key={template.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-700">{template.title}</h4>
                <button
                  onClick={() => handleCopy(template.content, template.id)}
                  className={`p-1.5 rounded transition-colors ${
                    copiedId === template.id 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-white text-slate-500 hover:text-blue-600 border border-slate-200'
                  }`}
                  title="Copy to clipboard"
                >
                  {copiedId === template.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-mono bg-white p-3 rounded border border-slate-200">
                {template.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;