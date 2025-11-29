import React, { useState } from 'react';
import { useHealth } from '../store';
import { analyzeDream } from '../geminiService';
import { Moon, CloudMoon, Clock, Star } from 'lucide-react';
import { SleepQuality } from '../types';
import ReactMarkdown from 'react-markdown';

const SleepView: React.FC = () => {
  const { setSleep, sleepLog } = useHealth();
  
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState<SleepQuality>('Good');
  const [dream, setDream] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${bedTime}`);
    let end = new Date(`2000-01-01T${wakeTime}`);
    if (end < start) {
        end = new Date(`2000-01-02T${wakeTime}`);
    }
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.round(diff * 10) / 10;
  };

  const handleSubmit = async () => {
    let dreamAnalysis = '';
    if (dream.length > 5) {
      setAnalyzing(true);
      dreamAnalysis = await analyzeDream(dream);
      setAnalyzing(false);
    }

    setSleep({
      date: new Date().toISOString(),
      bedTime,
      wakeTime,
      durationHours: calculateDuration(),
      quality,
      dreamDescription: dream,
      dreamAnalysis: dreamAnalysis
    });
  };

  if (sleepLog) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
        <div className="bg-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Moon size={200} />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-8 relative z-10">Last Night's Sleep</h2>
          
          <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 relative z-10">
            <div className="bg-white/10 rounded-2xl p-4 md:p-6 text-center backdrop-blur-sm">
              <div className="text-3xl md:text-5xl font-bold mb-2">{sleepLog.durationHours}h</div>
              <div className="text-indigo-200 text-xs md:text-sm">{sleepLog.bedTime} - {sleepLog.wakeTime}</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 md:p-6 text-center backdrop-blur-sm flex flex-col justify-center items-center">
              <div className="text-xl md:text-3xl font-bold mb-2 text-yellow-300">{sleepLog.quality}</div>
              <div className="text-indigo-200 uppercase tracking-widest text-[10px] md:text-xs">Quality Score</div>
            </div>
          </div>

          {sleepLog.dreamAnalysis && (
            <div className="bg-indigo-800/50 rounded-xl p-4 md:p-6 border border-indigo-700/50 relative z-10">
              <h3 className="font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                <CloudMoon size={18} /> Dream Analysis
              </h3>
              <div className="prose prose-invert prose-sm text-indigo-100 italic leading-relaxed">
                <ReactMarkdown>{sleepLog.dreamAnalysis}</ReactMarkdown>
              </div>
            </div>
          )}

          <button 
            onClick={() => setSleep(null as any)}
            className="mt-8 text-sm text-indigo-300 hover:text-white underline decoration-dashed underline-offset-4 relative z-10"
          >
            Edit Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Moon size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Log Sleep & Dreams</h2>
          <p className="text-slate-500">How did you rest last night?</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bedtime</label>
                <div className="relative">
                    <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="time" 
                        value={bedTime}
                        onChange={(e) => setBedTime(e.target.value)}
                        className="w-full pl-10 p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Wake Time</label>
                <div className="relative">
                    <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="time" 
                        value={wakeTime}
                        onChange={(e) => setWakeTime(e.target.value)}
                        className="w-full pl-10 p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quality</label>
            <div className="grid grid-cols-4 gap-2">
                {(['Poor', 'Fair', 'Good', 'Excellent'] as SleepQuality[]).map((q) => (
                    <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`py-2 px-1 rounded-lg text-sm border transition-all ${
                            quality === q 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {q}
                    </button>
                ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-2 flex items-center gap-2">
              <CloudMoon size={18} />
              Dream Journal <span className="text-slate-400 font-normal text-xs">(Optional)</span>
            </label>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
              placeholder="I was flying over a purple ocean..."
              value={dream}
              onChange={(e) => setDream(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={analyzing}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            {analyzing ? "Analyzing Dream..." : "Save Sleep Log"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepView;