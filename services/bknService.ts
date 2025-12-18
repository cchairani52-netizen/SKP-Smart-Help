import { SKPRealTimeData } from '../types';

// Simulasi API Delay dan Response
export const syncSKPData = async (nip: string): Promise<SKPRealTimeData> => {
  // Simulasi network latency (1.5 - 3 detik) untuk kesan "Real-time connecting"
  const delay = Math.floor(Math.random() * 1500) + 1500;
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulasi error acak (5% chance server busy)
      if (Math.random() < 0.05) {
        reject(new Error("Server E-Kinerja BKN sedang sibuk (Timeout). Silakan coba lagi."));
        return;
      }

      const now = new Date();
      const lastSync = now.toLocaleString('id-ID', { 
        day: '2-digit', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });

      // Data dinamis berdasarkan NIP (Mock)
      // Jika NIP diawali '1985' (contoh user senior), status sudah Persetujuan
      if (nip.startsWith('1985')) {
        resolve({
          periode: 'Januari - Desember',
          tahun: '2024',
          status_skp: 'Persetujuan',
          atasan_langsung: {
            nama: 'Dr. Hartono, M.Si',
            nip: '197001011995031002',
            status: 'Aktif'
          },
          jumlah_rhk: 5,
          predikat_triwulan_terakhir: 'Sangat Baik',
          last_sync: lastSync
        });
      } 
      // User default/baru
      else {
        resolve({
          periode: 'Januari - Desember',
          tahun: '2024',
          status_skp: 'Draft', // Status masih draft
          atasan_langsung: {
            nama: 'Siti Rahmawati, S.Sos',
            nip: '198005052005012005',
            status: 'Menunggu Persetujuan'
          },
          jumlah_rhk: 3,
          predikat_triwulan_terakhir: 'Baik',
          last_sync: lastSync
        });
      }
    }, delay);
  });
};