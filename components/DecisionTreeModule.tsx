import React, { useState } from 'react';
import { GitMerge, RotateCcw, CheckCircle, Phone, ArrowRight, HelpCircle, ChevronLeft } from 'lucide-react';
import { DECISION_TREE, CONTACTS } from '../constants';
import { DecisionNode, ContactInfo } from '../types';

const DecisionTreeModule: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['root']);
  const currentNodeId = history[history.length - 1];
  const currentNode: DecisionNode = DECISION_TREE[currentNodeId];

  const handleOptionClick = (nextId: string) => {
    setHistory([...history, nextId]);
  };

  const handleReset = () => {
    setHistory(['root']);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  // Find relevant contacts if needed
  const relevantContacts = currentNode.isContactTrigger 
    ? CONTACTS // In a real app, filter by problem type
    : [];

  // Calculate progress roughly
  const progress = Math.min((history.length / 5) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
            <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <GitMerge className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-800">Diagnosa Masalah</h2>
                <p className="text-xs text-slate-500">Jawab pertanyaan untuk menemukan solusi</p>
             </div>
          </div>
          {history.length > 1 && (
            <button 
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-blue-600 flex items-center font-medium bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Mulai Ulang
            </button>
          )}
        </div>

        <div className="p-6 md:p-10 bg-slate-50/30 min-h-[400px] flex flex-col justify-center">
          <div className="max-w-3xl mx-auto w-full">
            {/* Question/Statement Bubble */}
            <div className="mb-8 flex gap-4 animate-slide-up">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center shadow-lg border-2 border-white">
                  <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white p-6 rounded-2xl rounded-tl-none shadow-md border border-slate-100 relative">
                <div className="absolute top-0 left-0 -ml-2 mt-4 w-4 h-4 bg-white transform rotate-45 border-l border-b border-slate-100"></div>
                <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed">
                    {currentNode.text}
                </p>
              </div>
            </div>

            {/* Options or Solution */}
            <div className="pl-0 md:pl-16 space-y-4">
              {currentNode.options ? (
                <div className="grid grid-cols-1 gap-3">
                  {currentNode.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option.nextId)}
                      className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-md transition-all text-left animate-slide-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className="font-bold text-slate-700 group-hover:text-blue-700 text-lg">
                        {option.label}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 animate-fade-in shadow-sm">
                  <div className="flex items-start">
                    <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-900 text-xl mb-3">Solusi Ditemukan</h3>
                      <div className="prose prose-emerald text-emerald-800 leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl border border-emerald-100/50">
                        {currentNode.solution}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Suggestion Card */}
              {currentNode.isContactTrigger && relevantContacts.length > 0 && (
                <div className="mt-8 bg-white border border-orange-100 rounded-2xl p-6 shadow-sm relative overflow-hidden animate-fade-in delay-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-12 -mt-12"></div>
                  <h3 className="text-slate-800 font-bold mb-4 flex items-center relative z-10">
                    <Phone className="w-5 h-5 mr-2 text-orange-500" />
                    Perlu bantuan lanjutan?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {relevantContacts.map(contact => (
                      <div key={contact.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-slate-800">{contact.name}</p>
                                <p className="text-xs text-slate-500 mb-2 font-medium bg-slate-100 px-2 py-0.5 rounded w-fit">{contact.role}</p>
                            </div>
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Phone className="w-4 h-4" />
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {contact.specialty.map(spec => (
                            <span key={spec} className="bg-slate-50 text-slate-600 text-[10px] px-2 py-1 rounded border border-slate-100">
                              {spec}
                            </span>
                          ))}
                        </div>
                        <a 
                          href={`https://wa.me/${contact.whatsapp}`} 
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-bold text-sm transition-all shadow-md shadow-green-200 group-hover:-translate-y-1"
                        >
                          Chat WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {history.length > 1 && currentNode.options && (
              <div className="mt-8 pl-0 md:pl-16">
                <button onClick={handleBack} className="text-slate-400 hover:text-slate-600 text-sm flex items-center font-medium transition-colors">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke langkah sebelumnya
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionTreeModule;