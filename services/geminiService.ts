import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateAIResponse = async (query: string, context?: string): Promise<string> => {
  if (!apiKey) {
    return "Maaf, kunci API belum dikonfigurasi. Hubungi administrator.";
  }

  try {
    const systemPrompt = `
      Anda adalah Asisten Cerdas bernama "SKP Smart Help". 
      Tugas Anda adalah membantu ASN (Aparatur Sipil Negara) di Indonesia mengenai masalah Sasaran Kinerja Pegawai (SKP) dan aplikasi E-Kinerja BKN.
      
      Gunakan bahasa Indonesia yang formal, sopan, namun mudah dipahami.
      
      Pengetahuan dasar:
      1. Regulasi utama: PermenPANRB No. 6 Tahun 2022 tentang Pengelolaan Kinerja.
      2. Aplikasi: E-Kinerja BKN.
      3. Masalah umum: Login, SKP Atasan, Matriks Peran Hasil, Bukti Dukung.

      Jika pertanyaan tidak berhubungan dengan SKP atau kepegawaian, tolak dengan sopan.
      Jika pertanyaan membutuhkan penanganan teknis mendalam (seperti merubah database), arahkan untuk menghubungi tim teknis/admin instansi.

      ${context ? `Konteks tambahan dari aplikasi: ${context}` : ''}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3, // Low temperature for more factual answers
      }
    });

    return response.text || "Maaf, saya tidak dapat menghasilkan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi nanti.";
  }
};
