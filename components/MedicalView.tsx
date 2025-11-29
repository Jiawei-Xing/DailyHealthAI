import React, { useState, useRef } from 'react';
import { useHealth } from '../store';
import { consultMedicalAgent, analyzeMedicalResult } from '../geminiService';
import { FileText, Stethoscope, AlertTriangle, MessageSquarePlus, Save, Upload, Loader2, ScanLine, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MedicalView: React.FC = () => {
  const { profile, updateProfile } = useHealth();
  
  // Consult State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);

  // Image Analysis State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  const handleConsult = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer(null);
    setProfileUpdated(false);
    const response = await consultMedicalAgent(profile, question);
    setAnswer(response);
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        setAnalyzingImage(true);
        setAnswer(null);
        setProfileUpdated(false);
        const result = await analyzeMedicalResult(base64);
        setAnswer(result);
        setAnalyzingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const appendToProfile = () => {
    if (answer) {
        // Append full result without truncation for better history tracking
        const newHistory = profile.medicalHistory + "\n\n--- MEDICAL RESULT (" + new Date().toLocaleDateString() + ") ---\n" + answer + "\n-----------------------------------";
        updateProfile({ medicalHistory: newHistory });
        setProfileUpdated(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6 h-full flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col flex-1">
         
         {/* Header */}
         <div className="p-6 border-b border-slate-100 bg-red-50/50">
             <div className="flex items-center gap-3">
                 <div className="bg-red-100 p-2 rounded-full text-red-600">
                     <Stethoscope size={24} />
                 </div>
                 <div>
                     <h2 className="text-xl font-bold text-slate-900">Medical Agent</h2>
                     <p className="text-slate-500 text-sm">Upload test results or ask health questions.</p>
                 </div>
             </div>
         </div>

         <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Input Area */}
            <div className="relative">
                <textarea 
                    className="w-full border border-slate-200 rounded-xl p-4 pr-14 h-40 focus:ring-2 focus:ring-red-200 outline-none resize-none shadow-sm transition-all"
                    placeholder="e.g., I have a sharp pain in my lower back, or upload your blood test results..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={analyzingImage || loading}
                        className="bg-slate-100 text-slate-600 p-2.5 rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium text-sm"
                        title="Upload Medical Result"
                    >
                        {analyzingImage ? <Loader2 size={18} className="animate-spin" /> : <ScanLine size={18} />}
                        <span className="hidden md:inline">Upload Result</span>
                    </button>
                    <button 
                        onClick={handleConsult}
                        disabled={loading || !question}
                        className="bg-red-600 text-white p-2.5 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-200"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>

            {(loading || analyzingImage) && (
                <div className="flex flex-col items-center py-12 text-slate-400 animate-pulse">
                        <Stethoscope size={32} className="mb-4 text-red-300" />
                        <p>{analyzingImage ? "Scanning medical document..." : "Consulting medical knowledge base..."}</p>
                </div>
            )}

            {answer && !loading && !analyzingImage && (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-red-600 font-bold">
                                <AlertTriangle size={18} />
                                <span>AI Analysis</span>
                            </div>
                            {!profileUpdated ? (
                                <button 
                                    onClick={appendToProfile}
                                    className="text-xs font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:shadow-sm transition-all"
                                >
                                    <Save size={14} /> Add to History
                                </button>
                            ) : (
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                    <CheckIcon /> Added to Profile
                                </span>
                            )}
                        </div>
                        <div className="prose prose-sm prose-red max-w-none text-slate-700 leading-relaxed">
                            <ReactMarkdown>{answer}</ReactMarkdown>
                        </div>
                </div>
            )}

         </div>
      </div>
    </div>
  );
};

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default MedicalView;