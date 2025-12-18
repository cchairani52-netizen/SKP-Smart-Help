import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Activity, Users, FileBarChart } from 'lucide-react';
import { UserProfile, UserAccount } from '../types';

interface LoginModuleProps {
  onLogin: (user: UserProfile) => void;
  users: UserAccount[];
}

const LoginModule: React.FC<LoginModuleProps> = ({ onLogin, users }) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (!nip || !password) {
        setError('NIP dan Password wajib diisi.');
        setLoading(false);
        return;
      }

      const matchedUser = users.find(u => u.nip === nip && u.password === password);

      if (matchedUser) {
        onLogin({
          nip: matchedUser.nip,
          name: matchedUser.name,
          role: matchedUser.role,
          unitKerja: matchedUser.unitKerja
        });
      } else {
        setError('NIP atau Password salah.');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
         <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row z-10 border border-white/50">
        
        {/* Left Side: Brand & Visuals */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10">
            <div className="inline-flex bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-6 shadow-inner border border-white/10">
               <ShieldCheck className="w-8 h-8 text-yellow-300" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">SKP Smart Help</h1>
            <p className="text-blue-100 text-sm font-medium opacity-90">Asisten Cerdas Kepegawaian & Kinerja ASN</p>
          </div>

          <div className="relative z-10 space-y-6 my-8">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors">
                <div className="bg-white/20 p-2 rounded-lg"><Activity className="w-5 h-5 text-emerald-300" /></div>
                <div>
                    <h3 className="font-bold text-sm">Solusi Masalah Cepat</h3>
                    <p className="text-xs text-blue-100 opacity-80">Panduan langkah demi langkah</p>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors">
                <div className="bg-white/20 p-2 rounded-lg"><Users className="w-5 h-5 text-orange-300" /></div>
                <div>
                    <h3 className="font-bold text-sm">Konsultasi Helpdesk</h3>
                    <p className="text-xs text-blue-100 opacity-80">Terhubung dengan tim teknis</p>
                </div>
            </div>
             <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors">
                <div className="bg-white/20 p-2 rounded-lg"><FileBarChart className="w-5 h-5 text-purple-300" /></div>
                <div>
                    <h3 className="font-bold text-sm">Bank Pengetahuan</h3>
                    <p className="text-xs text-blue-100 opacity-80">Kumpulan FAQ terlengkap</p>
                </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-blue-200/60 font-mono">
            v2.5.0 &copy; 2024 Badan Kepegawaian
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
             <h2 className="text-2xl font-bold text-slate-800">Selamat Datang</h2>
             <p className="text-slate-500 text-sm mt-1">Silakan masuk dengan akun SIASN/SSO Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center animate-shake">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIP / ID Pengguna</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  placeholder="Contoh: 1985xxxx"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full group flex items-center justify-center py-4 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sedang Memverifikasi...' : (
                <>
                  Masuk Aplikasi <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400 mb-3">Akun Demo (Klik untuk menyalin)</p>
             <div className="flex gap-2 justify-center flex-wrap">
                <button 
                  onClick={() => { setNip('user'); setPassword('user'); }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 transition-colors"
                >
                    user / user
                </button>
                <button 
                   onClick={() => { setNip('admin'); setPassword('admin'); }}
                   className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-mono text-purple-600 transition-colors"
                >
                    admin / admin
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for icon (make sure to import AlertCircle)
import { AlertCircle } from 'lucide-react';

export default LoginModule;