import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, CheckCircle2, AlertCircle, FileText, UserCheck, BarChart2, ShieldCheck } from 'lucide-react';
import { syncSKPData } from '../services/bknService';
import { SKPRealTimeData, UserProfile } from '../types';

interface SKPRealTimeCardProps {
  user: UserProfile;
}

const SKPRealTimeCard: React.FC<SKPRealTimeCardProps> = ({ user }) => {
  const [data, setData] = useState<SKPRealTimeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto sync on mount (optional, or manual only)
  useEffect(() => {
    handleSync();
  }, []);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await syncSKPData(user.nip);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Gagal terhubung ke API BKN");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Persetujuan': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pengajuan': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Dinilai': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="bg-blue-100 p-2 rounded-lg">
             <Server className="w-5 h-5 text-blue-600" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 text-sm md:text-base">Integrasi E-Kinerja BKN</h3>
             <p className="text-[10px] text-slate-500 flex items-center gap-1">
               <ShieldCheck className="w-3 h-3 text-green-500" />
               Secure Connection (TLS 1.3)
             </p>
           </div>
        </div>
        
        <button 
          onClick={handleSync}
          disabled={loading}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            loading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Menyinkronkan...' : 'Sync Data'}
        </button>
      </div>

      <div className="p-5">
        {error ? (
           <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
             <div className="bg-red-50 p-3 rounded-full mb-3">
               <AlertCircle className="w-8 h-8 text-red-500" />
             </div>
             <p className="text-sm font-medium text-slate-800 mb-1">Gagal Sinkronisasi</p>
             <p className="text-xs text-slate-500 mb-3 max-w-[200px]">{error}</p>
             <button onClick={handleSync} className="text-xs text-blue-600 font-bold hover:underline">Coba Lagi</button>
           </div>
        ) : !data && loading ? (
           <div className="py-10 text-center space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto"></div>
              <p className="text-xs text-slate-400 mt-2">Mengambil data dari server ekierja.bkn.go.id...</p>
           </div>
        ) : data ? (
           <div className="space-y-5 animate-slide-up">
              {/* Main Status */}
              <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                        <FileText className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Status SKP {data.tahun}</p>
                        <span className={`inline-block px-2 py-0.5 mt-1 rounded text-xs font-bold border ${getStatusColor(data.status_skp)}`}>
                            {data.status_skp}
                        </span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium">Periode</p>
                    <p className="text-sm font-bold text-slate-700">{data.periode}</p>
                 </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-white border border-slate-100 rounded-lg hover:border-blue-200 transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                        <UserCheck className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500">Atasan Langsung</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{data.atasan_langsung.nama}</p>
                    <p className="text-[10px] text-slate-500">{data.atasan_langsung.status}</p>
                 </div>
                 
                 <div className="p-3 bg-white border border-slate-100 rounded-lg hover:border-blue-200 transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                        <BarChart2 className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500">Predikat</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{data.predikat_triwulan_terakhir}</p>
                    <p className="text-[10px] text-slate-500">Triwulan Terakhir</p>
                 </div>
              </div>

              {/* RHK Progress Bar (Visual only based on count) */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-500">Rencana Hasil Kerja (RHK)</span>
                    <span className="font-bold text-indigo-600">{data.jumlah_rhk} Butir</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[75%]"></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                 <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Terakhir disinkronisasi: {data.last_sync} WIB
                 </p>
              </div>
           </div>
        ) : null}
      </div>
    </div>
  );
};

export default SKPRealTimeCard;