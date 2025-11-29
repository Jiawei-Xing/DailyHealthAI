import React, { useState, useEffect, useRef } from 'react';
import { useHealth } from '../store';
import { chatWithCounselor, generateJournalEntry } from '../geminiService';
import { Send, MessageCircleHeart, BookOpen, Loader2, Smile, Frown, Meh, CloudRain, Sun } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CounselorView: React.FC = () => {
  const { chatHistory, addChatMessage, currentEmotion, setEmotion } = useHealth();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [journal, setJournal] = useState<string | null>(null);
  const [generatingJournal, setGeneratingJournal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    addChatMessage({
      id: Date.now().toString(),
      sender: 'user',
      text: userMsg,
      timestamp: new Date()
    });

    setIsTyping(true);

    const historyForApi = chatHistory.map(m => ({
      role: m.sender,
      parts: [{ text: m.text }]
    }));

    if (currentEmotion && chatHistory.length === 0) {
        historyForApi.push({role: 'user', parts: [{text: `(System Note: User is feeling ${currentEmotion} right now)`}]});
    }

    const responseText = await chatWithCounselor(historyForApi, userMsg);

    setIsTyping(false);
    addChatMessage({
      id: (Date.now() + 1).toString(),
      sender: 'agent',
      text: responseText,
      timestamp: new Date()
    });
  };

  const handleGenerateJournal = async () => {
    if (chatHistory.length < 2) return;
    setGeneratingJournal(true);
    const historyText = chatHistory.map(c => `${c.sender}: ${c.text}`).join('\n');
    const result = await generateJournalEntry(historyText);
    setJournal(result);
    setGeneratingJournal(false);
  };

  const emotions = [
      { label: 'Great', icon: Sun, color: 'text-yellow-500' },
      { label: 'Good', icon: Smile, color: 'text-emerald-500' },
      { label: 'Okay', icon: Meh, color: 'text-blue-400' },
      { label: 'Sad', icon: CloudRain, color: 'text-indigo-400' },
      { label: 'Stressed', icon: Frown, color: 'text-red-400' },
  ];

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-0 md:p-6 pb-20 md:pb-6">
      <div className="flex-1 bg-white md:rounded-2xl shadow-sm border-x md:border border-slate-100 overflow-hidden flex flex-col h-screen md:h-auto">
        {/* Header */}
        <div className="bg-emerald-50 p-4 border-b border-emerald-100">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                        <MessageCircleHeart size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800">Counselor</h2>
                        <p className="text-xs text-slate-500">Always here to listen.</p>
                    </div>
                </div>
                {chatHistory.length > 2 && (
                    <button 
                        onClick={handleGenerateJournal}
                        disabled={generatingJournal}
                        className="text-emerald-700 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-emerald-50"
                    >
                        {generatingJournal ? <Loader2 size={14} className="animate-spin" /> : <BookOpen size={14} />}
                        Journal
                    </button>
                )}
            </div>

            {/* Emotion Selector */}
            {chatHistory.length === 0 && (
                <div className="flex gap-2 justify-between md:justify-start">
                    {emotions.map((emo) => (
                        <button
                            key={emo.label}
                            onClick={() => setEmotion(emo.label)}
                            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                                currentEmotion === emo.label 
                                ? 'bg-white shadow-sm ring-2 ring-emerald-500' 
                                : 'hover:bg-emerald-100/50'
                            }`}
                        >
                            <emo.icon size={20} className={emo.color} />
                            <span className="text-[10px] text-slate-600 mt-1">{emo.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        {/* Journal Overlay */}
        {journal && (
            <div className="bg-amber-50 p-4 border-b border-amber-200 relative animate-in slide-in-from-top-2">
                <button onClick={() => setJournal(null)} className="absolute top-2 right-2 text-amber-800 hover:text-amber-900 font-bold px-2">×</button>
                <h3 className="text-amber-900 font-bold text-sm mb-1 flex items-center gap-2"><BookOpen size={14}/> Daily Reflection</h3>
                <div className="prose prose-sm prose-amber text-amber-900/80 italic max-w-none">
                    <ReactMarkdown>{journal}</ReactMarkdown>
                </div>
            </div>
        )}

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
        >
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
               <MessageCircleHeart size={48} className="mb-2" />
               <p>How are you feeling today?</p>
            </div>
          )}
          
          {chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 md:p-4 text-sm md:text-base ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.sender === 'agent' ? (
                   <div className="prose prose-sm max-w-none text-slate-700">
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                   </div>
                ) : (
                   <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
                
                <p className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex gap-1">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={currentEmotion ? `Tell me more about feeling ${currentEmotion.toLowerCase()}...` : "Type your message..."}
              className="flex-1 border border-slate-200 rounded-full px-4 md:px-6 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm md:text-base"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-200"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorView;