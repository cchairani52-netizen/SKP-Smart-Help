import React, { useState } from 'react';
import Header from './components/Header';
import FAQModule from './components/FAQModule';
import DecisionTreeModule from './components/DecisionTreeModule';
import ConsultationModule from './components/ConsultationModule';
import StaffDashboard from './components/StaffDashboard';
import AIAssistant from './components/AIAssistant';
import LoginModule from './components/LoginModule';
import FAQManagementModule from './components/FAQManagementModule';
import UserManagementModule from './components/UserManagementModule';
import SKPRealTimeCard from './components/SKPRealTimeCard';
import { MOCK_FAQS, MOCK_USERS } from './constants';
import { UserProfile, FAQItem, UserAccount } from './types';
import { Sparkles, GitMerge, FileQuestion, Megaphone, CalendarClock, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // State for FAQs (Lifted up so changes persist in session)
  const [faqs, setFaqs] = useState<FAQItem[]>(MOCK_FAQS);
  
  // State for Users
  const [users, setUsers] = useState<UserAccount[]>(MOCK_USERS);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setActiveTab(loggedInUser.role === 'admin' ? 'staff' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!user) {
    return <LoginModule onLogin={handleLogin} users={users} />;
  }

  const renderContent = () => {
    // Basic route protection
    if (activeTab === 'staff' && user.role !== 'admin') {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2>
                <p className="text-slate-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            </div>
        );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-8">
               {/* Hero Section */}
               <div className="relative overflow-hidden rounded-2xl shadow-xl">
                 <div className={`absolute inset-0 ${user.role === 'admin' ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`}></div>
                 {/* Decorative background circles */}
                 <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                 <div className="absolute left-10 bottom-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                 
                 <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 uppercase tracking-wide">
                                {user.role === 'admin' ? 'Administrator Mode' : 'ASN Dashboard'}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                            Halo, {user.name.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-blue-100 text-lg mb-6 max-w-lg leading-relaxed opacity-90">
                        {user.role === 'admin' 
                            ? 'Selamat datang di pusat kendali. Siap untuk mengelola layanan hari ini?' 
                            : 'Mengalami kendala SKP? Jangan khawatir, pilih bantuan di bawah ini.'}
                        </p>
                        
                        {user.role !== 'admin' && (
                            <div className="flex flex-wrap gap-3">
                                <button 
                                    onClick={() => setActiveTab('solver')}
                                    className="group bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center"
                                >
                                    <GitMerge className="w-5 h-5 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                                    Diagnosa Masalah
                                </button>
                                <button 
                                    onClick={() => setActiveTab('assistant')}
                                    className="group bg-indigo-500/30 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center"
                                >
                                    <Sparkles className="w-5 h-5 mr-2 text-yellow-300 group-hover:rotate-12 transition-transform" />
                                    Tanya AI
                                </button>
                            </div>
                        )}
                        {user.role === 'admin' && (
                             <button 
                                onClick={() => setActiveTab('staff')}
                                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg flex items-center"
                            >
                                Buka Dashboard Admin <ChevronRight className="ml-2 w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {/* Hero Illustration Placeholder (Icon based) */}
                    <div className="hidden md:block opacity-20 transform rotate-12">
                        <FileQuestion className="w-40 h-40 text-white" />
                    </div>
                 </div>
               </div>
               
               {/* Search/FAQ Module */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <FAQModule faqs={faqs} />
               </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* REAL TIME SKP WIDGET (Only for ASN) */}
              {user.role === 'asn' && (
                  <SKPRealTimeCard user={user} />
              )}

              {/* Announcement Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                
                <h3 className="font-bold text-slate-800 mb-4 flex items-center relative z-10">
                    <Megaphone className="w-5 h-5 mr-2 text-orange-500" />
                    Info Terkini
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors">
                    <div className="flex items-start gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mt-1">
                            <CalendarClock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Batas SKP 2024</p>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Penyusunan SKP Tahunan maksimal <span className="font-bold text-orange-600">31 Januari 2024</span>.</p>
                        </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-start gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 mt-1">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Fitur Baru: Matriks</p>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Menu Matriks Peran Hasil kini otomatis terisi sesuai RHK.</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links / Mini Stats */}
              {user.role === 'asn' && (
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-3 text-sm uppercase tracking-wider">Status Layanan</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Server E-Kinerja</span>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded-full shadow-sm">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Antrian Helpdesk</span>
                        <span className="flex items-center text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-full shadow-sm">
                            Normal
                        </span>
                    </div>
                  </div>
              )}
            </div>
          </div>
        );
      case 'solver':
        return <DecisionTreeModule />;
      case 'assistant':
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <AIAssistant />
          </div>
        );
      case 'consult':
        return <ConsultationModule user={user} />;
      case 'staff': // This is now Admin Dashboard
        return <StaffDashboard />;
      case 'manage-faq':
        return <FAQManagementModule currentFaqs={faqs} onUpdate={setFaqs} />;
      case 'manage-users':
        return <UserManagementModule users={users} onUpdateUsers={setUsers} />;
      default:
        return <FAQModule faqs={faqs} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-200 selection:text-blue-900">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-12 max-w-7xl">
        {renderContent()}
      </main>
      
      {/* Sticky Mobile CTA - Only for Users */}
      {user.role === 'asn' && activeTab !== 'consult' && activeTab !== 'assistant' && (
        <div className="md:hidden fixed bottom-6 right-6 z-40 animate-bounce-subtle">
           <button 
             onClick={() => setActiveTab('consult')}
             className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full p-4 shadow-xl shadow-emerald-500/40 hover:scale-110 transition-transform"
           >
             <Megaphone className="h-6 w-6" />
           </button>
        </div>
      )}
    </div>
  );
};

export default App;