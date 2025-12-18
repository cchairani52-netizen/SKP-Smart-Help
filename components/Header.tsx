import React from 'react';
import { Menu, LogOut, LayoutDashboard, MessageSquareText, Shield, UserCog, Bot, GitMerge, FileText } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  // Navigasi Dinamis berdasarkan Role dengan Ikon
  const getNavItems = () => {
    const commonItems = [
        { id: 'dashboard', label: 'Beranda', icon: <LayoutDashboard className="w-4 h-4" /> },
    ];

    if (user?.role === 'admin') {
        return [
            ...commonItems,
            { id: 'staff', label: 'Admin Panel', icon: <Shield className="w-4 h-4" /> }, 
            { id: 'manage-faq', label: 'Kelola FAQ', icon: <MessageSquareText className="w-4 h-4" /> },
            { id: 'manage-users', label: 'Kelola User', icon: <UserCog className="w-4 h-4" /> },
        ];
    }

    // Default User (ASN)
    return [
        ...commonItems,
        { id: 'solver', label: 'Diagnosa', icon: <GitMerge className="w-4 h-4" /> },
        { id: 'assistant', label: 'Asisten AI', icon: <Bot className="w-4 h-4" /> },
        { id: 'consult', label: 'Konsultasi', icon: <FileText className="w-4 h-4" /> },
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-18 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => user && setActiveTab('dashboard')}>
            <div className={`p-2.5 rounded-xl shadow-lg transform group-hover:rotate-3 transition-all duration-300 ${
                user?.role === 'admin' 
                ? 'bg-gradient-to-br from-slate-700 to-slate-900' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-600'
            }`}>
              <span className="text-white font-black text-xl tracking-tighter">
                {user?.role === 'admin' ? 'ADM' : 'SKP'}
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 leading-none mb-0.5">
                Smart Help
              </h1>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                {user?.role === 'admin' ? 'Administrator Panel' : 'Asisten Kepegawaian'}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          {user && (
            <nav className="hidden md:flex items-center p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white text-blue-600 shadow-md transform scale-105'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              
              <div className="h-6 w-px bg-slate-300 mx-3"></div>
              
              <div className="flex items-center gap-3 pr-1">
                <div className="text-right hidden lg:block leading-tight">
                    <p className="text-xs font-bold text-slate-700">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{user.nip}</p>
                </div>
                <button 
                    onClick={onLogout}
                    className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Keluar"
                >
                    <LogOut className="w-4 h-4" />
                </button>
              </div>
            </nav>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Nav */}
      {user && (
        <div className="md:hidden overflow-x-auto whitespace-nowrap px-4 py-3 border-t border-slate-100 bg-white flex items-center shadow-inner">
            {navItems.map((item) => (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 mr-3 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
            >
                {item.icon}
                {item.label}
            </button>
            ))}
            <button onClick={onLogout} className="ml-auto text-xs text-red-600 font-bold px-4 py-2 border border-red-200 rounded-full bg-red-50">
                Keluar
            </button>
        </div>
      )}
    </header>
  );
};

export default Header;