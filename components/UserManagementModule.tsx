import React, { useState } from 'react';
import { Plus, Trash2, UserPlus, Users, Shield, User, Briefcase, Lock, Search, AlertCircle } from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface UserManagementModuleProps {
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
}

const UserManagementModule: React.FC<UserManagementModuleProps> = ({ users, onUpdateUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    nip: '',
    name: '',
    role: 'asn' as UserRole,
    unitKerja: '',
    password: ''
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nip || !formData.name || !formData.password || !formData.unitKerja) {
      alert('Semua data wajib diisi.');
      return;
    }

    const exists = users.find(u => u.nip === formData.nip);
    if (exists) {
        alert('NIP/Username sudah terdaftar.');
        return;
    }

    const newUser: UserAccount = {
        ...formData
    };

    onUpdateUsers([...users, newUser]);
    showNotification(`User ${formData.name} berhasil ditambahkan.`);
    
    // Reset form
    setFormData({
        nip: '',
        name: '',
        role: 'asn',
        unitKerja: '',
        password: ''
    });
  };

  const handleDeleteUser = (nip: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        const updatedUsers = users.filter(u => u.nip !== nip);
        onUpdateUsers(updatedUsers);
        showNotification('User berhasil dihapus.');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.unitKerja?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
       {notification && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-bounce">
          <Shield className="w-5 h-5 mr-2" />
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah User */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                Tambah Pengguna
            </h2>
            <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIP / Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            value={formData.nip}
                            onChange={(e) => setFormData({...formData, nip: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                            placeholder="1985..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                        placeholder="Nama Pegawai"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit Kerja</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            value={formData.unitKerja}
                            onChange={(e) => setFormData({...formData, unitKerja: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                            placeholder="Dinas/Badan..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role / Peran</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none bg-white"
                    >
                        <option value="asn">ASN (User)</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                            placeholder="Password login"
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">* Password terlihat untuk kemudahan demo admin.</p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Simpan User
                </button>
            </form>
        </div>

        {/* Daftar User */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-slate-500" />
                    Daftar Pengguna ({filteredUsers.length})
                </h2>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Cari user..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Nama & NIP</th>
                            <th className="px-4 py-3">Unit Kerja</th>
                            <th className="px-4 py-3 text-center">Role</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.nip} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <p className="font-bold text-slate-800">{user.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{user.nip}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                    {user.unitKerja}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        user.role === 'admin' 
                                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                        : 'bg-green-100 text-green-700 border border-green-200'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button 
                                        onClick={() => handleDeleteUser(user.nip)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus User"
                                        disabled={user.nip === 'admin'} // Protect main admin
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-500">
                                    <div className="flex flex-col items-center">
                                        <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                                        <p>User tidak ditemukan.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModule;