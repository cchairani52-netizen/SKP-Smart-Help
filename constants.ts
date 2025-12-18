import { FAQItem, DecisionNode, ContactInfo, StatData, TemplateResponse, ConsultationTicket, UserAccount } from './types';

export const CATEGORIES = [
  "Semua",
  "Pengisian SKP",
  "Penilaian",
  "Masalah Teknis",
  "Regulasi",
  "Akun & Jabatan"
];

export const MOCK_USERS: UserAccount[] = [
  {
    nip: 'admin',
    password: 'admin',
    name: 'Administrator SKP',
    role: 'admin',
    unitKerja: 'Biro SDM / BKD'
  },
  {
    nip: 'user',
    password: 'user',
    name: 'Budi Santoso',
    role: 'asn',
    unitKerja: 'Dinas Pendidikan'
  },
  {
    nip: '198501012010011001',
    password: '123',
    name: 'Ahmad Yani',
    role: 'asn',
    unitKerja: 'Dinas Kominfo'
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'Pengisian SKP',
    question: 'Bagaimana jika SKP Atasan belum muncul saat saya membuat SKP?',
    answer: 'Pastikan Atasan Langsung Anda sudah membuat SKP dan statusnya sudah "Persetujuan". Jika belum, Anda tidak dapat menarik intervensi RHK atasan. Hubungi admin unit kerja jika status atasan sudah sesuai namun masih tidak muncul.',
    views: 1250
  },
  {
    id: '2',
    category: 'Masalah Teknis',
    question: 'Tombol "Simpan" tidak berfungsi saat mengisi Rencana Aksi.',
    answer: 'Ini biasanya terjadi karena cache browser atau koneksi tidak stabil. Coba refresh halaman (Ctrl+F5) atau gunakan browser lain (Chrome/Edge disarankan). Pastikan tidak ada karakter khusus (emoji) di kolom isian.',
    views: 980
  },
  {
    id: '3',
    category: 'Akun & Jabatan',
    question: 'Jabatan saya berubah di tengah tahun, bagaimana SKP-nya?',
    answer: 'Anda perlu membuat SKP baru untuk periode jabatan baru. SKP lama dinilai sampai bulan terakhir menjabat. Total nilai tahunan akan digabungkan secara proporsional.',
    views: 850
  },
  {
    id: '4',
    category: 'Penilaian',
    question: 'Nilai perilaku kerja saya kosong padahal atasan sudah menilai.',
    answer: 'Pastikan atasan sudah melakukan "Finalisasi" penilaian, bukan hanya menyimpan draft. Sistem E-Kinerja BKN membutuhkan status final untuk kalkulasi predikat.',
    views: 1100
  },
  {
    id: '5',
    category: 'Pengisian SKP',
    question: 'Apakah PPPK wajib mengisi SKP sama dengan PNS?',
    answer: 'Ya, sesuai PermenPANRB No. 6 Tahun 2022, pengelolaan kinerja berlaku untuk seluruh ASN (PNS dan PPPK). Format dan alur pengisian di E-Kinerja adalah sama.',
    views: 700
  }
];

export const DECISION_TREE: Record<string, DecisionNode> = {
  'root': {
    id: 'root',
    text: 'Apa kendala utama yang Anda alami saat ini?',
    options: [
      { label: 'Masalah Teknis Aplikasi (Error/Bug)', nextId: 'tech_issue' },
      { label: 'Masalah Konten/Substansi SKP', nextId: 'content_issue' },
      { label: 'Masalah Data Kepegawaian (Unor/Jabatan)', nextId: 'data_issue' }
    ]
  },
  'tech_issue': {
    id: 'tech_issue',
    text: 'Apakah error terjadi saat login atau saat menyimpan data?',
    options: [
      { label: 'Gagal Login (Password/SSO)', nextId: 'login_fail' },
      { label: 'Gagal Simpan / Loading Terus', nextId: 'save_fail' }
    ]
  },
  'save_fail': {
    id: 'save_fail',
    text: 'Coba bersihkan cache browser Anda (Ctrl+Shift+Delete) dan coba lagi. Apakah berhasil?',
    options: [
      { label: 'Ya, berhasil', nextId: 'solved_cache' },
      { label: 'Tidak, masih error', nextId: 'contact_it' }
    ]
  },
  'solved_cache': {
    id: 'solved_cache',
    text: 'Masalah terselesaikan. Penyebab umum adalah cache browser yang menumpuk.',
    solution: 'Tips: Lakukan clear cache secara berkala.'
  },
  'contact_it': {
    id: 'contact_it',
    text: 'Sepertinya ada gangguan server atau bug spesifik.',
    solution: 'Silakan hubungi Tim IT melalui kontak di bawah ini.',
    isContactTrigger: true
  },
  'login_fail': {
    id: 'login_fail',
    text: 'Apakah Anda sudah mencoba reset password di MyASN?',
    options: [
      { label: 'Sudah', nextId: 'sso_issue' },
      { label: 'Belum', nextId: 'try_reset' }
    ]
  },
  'try_reset': {
    id: 'try_reset',
    text: 'Silakan reset password Anda melalui https://myasn.bkn.go.id terlebih dahulu.',
    solution: 'Password E-Kinerja terintegrasi dengan MyASN/SSO BKN.'
  },
  'sso_issue': {
    id: 'sso_issue',
    text: 'Jika reset tidak berhasil, kemungkinan ada masalah sinkronisasi data.',
    solution: 'Hubungi Admin Kepegawaian Unit Kerja untuk cek status aktif akun.',
    isContactTrigger: true
  },
  'content_issue': {
    id: 'content_issue',
    text: 'Apakah terkait penyusunan RHK atau Penilaian?',
    options: [
      { label: 'Penyusunan RHK (Awal Tahun)', nextId: 'rhk_issue' },
      { label: 'Penilaian/Evaluasi', nextId: 'eval_issue' }
    ]
  },
  'rhk_issue': {
    id: 'rhk_issue',
    text: 'Apakah RHK Atasan sudah muncul untuk diintervensi?',
    options: [
      { label: 'Sudah, tapi bingung memilih', nextId: 'consult_perf' },
      { label: 'Belum muncul sama sekali', nextId: 'boss_status' }
    ]
  },
  'boss_status': {
    id: 'boss_status',
    text: 'Cek status SKP Atasan Langsung. Apakah statusnya sudah "Persetujuan"?',
    options: [
      { label: 'Sudah Persetujuan', nextId: 'hierarki_issue' },
      { label: 'Masih Draft/Pengajuan', nextId: 'wait_boss' }
    ]
  },
  'wait_boss': {
    id: 'wait_boss',
    text: 'Anda harus menunggu atasan menyelesaikan SKP-nya sampai status Persetujuan.',
    solution: 'Ingatkan atasan secara sopan untuk memfinalisasi SKP agar bawahan bisa menyusun.'
  },
  'hierarki_issue': {
    id: 'hierarki_issue',
    text: 'Jika sudah persetujuan tapi tidak muncul, ada kesalahan setting hierarki.',
    solution: 'Hubungi Admin Unit Kerja untuk perbaikan struktur/hierarki di SIASN.',
    isContactTrigger: true
  },
  'consult_perf': {
    id: 'consult_perf',
    text: 'Untuk konsultasi substansi kalimat RHK, gunakan panduan atau tanya konsultan kinerja.',
    solution: 'Gunakan fitur "Smart Search" atau tanya AI kami untuk contoh kalimat RHK.',
    isContactTrigger: true
  },
  'eval_issue': {
    id: 'eval_issue',
    text: 'Terkait bukti dukung atau feedback?',
    solution: 'Pastikan link Google Drive bukti dukung bersifat "Anyone with the link can view".'
  },
  'data_issue': {
    id: 'data_issue',
    text: 'Data Unor/Jabatan di E-Kinerja diambil dari SIASN. Apakah data di SIASN sudah benar?',
    options: [
      { label: 'Sudah Benar di SIASN', nextId: 'sync_issue' },
      { label: 'Salah di SIASN', nextId: 'update_siasn' }
    ]
  },
  'update_siasn': {
    id: 'update_siasn',
    text: 'Lakukan usul peremajaan data melalui Admin Kepegawaian.',
    solution: 'E-Kinerja hanya membaca data, perbaikan harus di sumber data (SIASN).'
  },
  'sync_issue': {
    id: 'sync_issue',
    text: 'Klik tombol "Sinkronisasi Data SIASN" di profil E-Kinerja (pojok kanan atas).',
    solution: 'Tunggu 1x24 jam setelah sinkronisasi. Jika tetap salah, lapor Helpdesk.',
    isContactTrigger: true
  }
};

export const CONTACTS: ContactInfo[] = [
  {
    id: 'c1',
    name: 'Budi Santoso, S.Kom',
    role: 'Tim Teknis IT',
    whatsapp: '6281234567890',
    email: 'it.helpdesk@instansi.go.id',
    specialty: ['Login', 'Error Aplikasi', 'Sinkronisasi'],
    availability: '08:00 - 16:00 WIB'
  },
  {
    id: 'c2',
    name: 'Siti Aminah, M.Psi',
    role: 'Konsultan Kinerja',
    whatsapp: '6281987654321',
    email: 'kinerja@instansi.go.id',
    specialty: ['Penyusunan RHK', 'Dialog Kinerja', 'Regulasi'],
    availability: '09:00 - 15:00 WIB'
  }
];

export const STATS_ISSUE_TYPE: StatData[] = [
  { name: 'Teknis Login', value: 400 },
  { name: 'Penyusunan SKP', value: 300 },
  { name: 'Penilaian', value: 300 },
  { name: 'Sinkronisasi Data', value: 200 },
];

export const STATS_MONTHLY: StatData[] = [
  { name: 'Jan', value: 500 }, // Awal tahun penyusunan
  { name: 'Feb', value: 200 },
  { name: 'Mar', value: 150 },
  { name: 'Apr', value: 300 }, // Triwulan 1
  { name: 'Mei', value: 100 },
  { name: 'Jun', value: 120 },
  { name: 'Jul', value: 350 }, // Triwulan 2
];

export const STAFF_TEMPLATES: TemplateResponse[] = [
  {
    id: 't1',
    title: 'Jabatan Belum Sesuai',
    content: 'Yth. Bapak/Ibu, pastikan data jabatan di SIASN sudah diperbarui oleh admin unit kerja. Setelah update di SIASN, silakan klik tombol "Sinkronisasi Data" pada menu Profil di E-Kinerja. Perubahan membutuhkan waktu update 1x24 jam.'
  },
  {
    id: 't2',
    title: 'Reset Password',
    content: 'Untuk reset password, silakan gunakan fitur "Lupa Password" pada laman MyASN (https://myasn.bkn.go.id). Password E-Kinerja terintegrasi dengan SSO BKN. Pastikan email yang terdaftar masih aktif.'
  },
  {
    id: 't3',
    title: 'SKP Atasan Tidak Muncul',
    content: 'Mohon pastikan Atasan Langsung sudah membuat SKP dengan status "Persetujuan". Jika status masih "Draft" atau "Pengajuan", maka intervensi RHK tidak akan muncul di akun bawahan.'
  }
];

export const MOCK_TICKETS: ConsultationTicket[] = [
    {
        id: 'T-2024-001',
        date: '2024-03-20',
        nip: '198501012010011001',
        name: 'Ahmad Yani',
        unit: 'Dinas Kominfo',
        category: 'Masalah Teknis',
        question: 'Gagal melakukan sinkronisasi Unor, muncul error "Service Unreachable". Mohon bantuannya.',
        answer: null,
        status: 'pending'
    },
    {
        id: 'T-2024-002',
        date: '2024-03-19',
        nip: '199012122019032005',
        name: 'Rina Wati',
        unit: 'BKD',
        category: 'Pengisian SKP',
        question: 'RHK saya tertukar dengan rekan kerja satu tim. Apakah bisa dihapus?',
        answer: 'Sedang dilakukan pengecekan pada log aktivitas sistem. Mohon menunggu.',
        status: 'processing'
    },
    {
        id: 'T-2024-003',
        date: '2024-03-18',
        nip: '198805052011011002',
        name: 'Budi Santoso',
        unit: 'Dinas Pendidikan',
        category: 'Penilaian',
        question: 'Nilai SKP 2023 belum masuk ke SIASN.',
        answer: 'Integrasi nilai SKP 2023 ke SIASN dilakukan secara berkala setiap hari Jumat pukul 16.00 WIB. Silakan cek kembali pada hari Senin.',
        status: 'resolved'
    },
    {
        id: 'T-2024-004',
        date: '2024-03-18',
        nip: '199507072020121003',
        name: 'Dewi Sartika',
        unit: 'Puskesmas Kota',
        category: 'Akun & Jabatan',
        question: 'Lupa password login MyASN dan email pemulihan sudah tidak aktif.',
        answer: 'Password telah direset manual ke default. Silakan hubungi admin unit kerja untuk detail kredensial sementara.',
        status: 'resolved'
    }
];