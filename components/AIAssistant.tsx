import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Halo! Saya Asisten SKP Smart Help. Ada yang bisa saya bantu mengenai E-Kinerja atau regulasi SKP hari ini?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass recent history context implicitly by framing the prompt
      const aiResponseText = await generateAIResponse(userMsg.content);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi gangguan saat memproses jawaban. Silakan coba lagi.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
        <h2 className="text-white font-bold flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
          Smart Assistant (AI)
        </h2>
        <p className="text-blue-100 text-xs mt-1">Ditenagai oleh Gemini AI &bull; Fokus pada Regulasi SKP</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-700' : 'bg-blue-600'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-white text-slate-800 border border-slate-200 rounded-tr-none' 
                : 'bg-blue-600 text-white rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
               <Bot className="w-5 h-5 text-white" />
             </div>
             <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center">
               <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
               <span className="text-sm text-slate-500">Sedang mengetik...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100 bg-white rounded-b-xl">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya tentang RHK, Bukti Dukung, atau PermenPANRB..."
            className="w-full pl-4 pr-12 py-3 rounded-full border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;