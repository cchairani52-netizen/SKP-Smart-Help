export type UserRole = 'asn' | 'admin';
export type TicketStatus = 'pending' | 'processing' | 'resolved';

export interface UserProfile {
  nip: string;
  name: string;
  role: UserRole;
  unitKerja?: string;
}

export interface UserAccount extends UserProfile {
  password?: string; // Optional because logged in user state might not keep it
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  views: number;
}

export interface DecisionNode {
  id: string;
  text: string;
  options?: { label: string; nextId: string }[];
  solution?: string;
  isContactTrigger?: boolean; // If true, show contact info
}

export interface ContactInfo {
  id: string;
  name: string;
  role: string;
  whatsapp: string;
  email: string;
  specialty: string[]; // e.g., ["Teknis", "Regulasi"]
  availability: string;
}

export interface StatData {
  name: string;
  value: number;
}

export interface TemplateResponse {
  id: string;
  title: string;
  content: string;
}

export interface ConsultationTicket {
  id: string;
  date: string;
  nip: string;
  name: string;
  unit: string;
  category: string;
  question: string;
  answer: string | null;
  status: TicketStatus;
}

// Interface baru untuk data Real-time BKN
export interface SKPRealTimeData {
  periode: string;
  tahun: string;
  status_skp: 'Draft' | 'Pengajuan' | 'Persetujuan' | 'Dinilai';
  atasan_langsung: {
    nama: string;
    nip: string;
    status: string;
  };
  jumlah_rhk: number;
  predikat_triwulan_terakhir: string;
  last_sync: string;
}