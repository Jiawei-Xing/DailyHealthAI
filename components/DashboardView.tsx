
import React, { useState } from 'react';
import { useHealth } from '../store';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Sparkles, Brain, Moon, Flame, MessageSquare, Send, Calendar, Smile, Archive, Utensils, BicepsFlexed, Check } from 'lucide-react';
import { askCoordinator } from '../geminiService';
import ReactMarkdown from 'react-markdown';

const DashboardView: React.FC = () => {
  const { 
    foodLog, 
    exerciseLog, 
    sleepLog, 
    dailyConsensus, 
    isSynthesizing, 
    triggerSynthesis,
    profile,
    daysActive,
    currentEmotion,
    history,
    resetDay
  } = useHealth();
  
  const state = useHealth(); // For coordinator context

  const totalCalories = foodLog.reduce((acc, curr) => acc + curr.calories, 0);
  const totalBurned = exerciseLog.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const netCalories = totalCalories - totalBurned;

  const macroData = [
    { name: 'Protein', value: foodLog.reduce((acc, curr) => acc + curr.protein, 0), color: '#3b82f6' },
    { name: 'Carbs', value: foodLog.reduce((acc, curr) => acc + curr.carbs, 0), color: '#10b981' },
    { name: 'Fats', value: foodLog.reduce((acc, curr) => acc + curr.fats, 0), color: '#f59e0b' },
  ];

  // Collaborative Chat State
  const [teamQuestion, setTeamQuestion] = useState('');
  const [teamAnswer, setTeamAnswer] = useState<string | null>(null);
  const [askingTeam, setAskingTeam] = useState(false);
  const [dayEnded, setDayEnded] = useState(false);

  const handleAskTeam = async () => {
    if (!teamQuestion.trim()) return;
    setAskingTeam(true);
    setTeamAnswer(null);
    const answer = await askCoordinator(state, teamQuestion);
    setTeamAnswer(answer);
    setAskingTeam(false);
  };

  const handleEndDay = () => {
    if (confirm("Are you sure? This will save nutrition, physical, and sleep records to your profile.")) {
        resetDay();
        setDayEnded(true);
        setTimeout(() => setDayEnded(false), 3000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Health Overview</h1>
          <p className="text-sm md:text-base text-slate-500">Welcome back, {profile.name}.</p>
        </div>
        
        <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full text-orange-600 font-bold text-sm border border-orange-100">
                <Flame size={16} fill="currentColor" />
                <span>{daysActive} Day Streak</span>
            </div>

            {currentEmotion && (
                <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-600 font-bold text-sm border border-indigo-100">
                    <Smile size={16} />
                    <span>Mood: {currentEmotion}</span>
                </div>
            )}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Nutrition Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Utensils size={20} className="text-blue-500" /> Nutrition
          </h3>
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-4xl font-bold text-slate-900">{totalCalories}</span>
              <span className="text-sm text-slate-500 ml-1">kcal</span>
            </div>
            <div className="text-right">
               <span className="text-sm text-emerald-600 font-medium">Net: {netCalories}</span>
            </div>
          </div>
          <div className="h-40">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={macroData}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
             <BicepsFlexed size={20} className="text-orange-500" /> Physical Activity
          </h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Burned</span>
                <span className="font-bold text-orange-600">{totalBurned} kcal</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Workouts</span>
                <span className="font-bold text-slate-900">{exerciseLog.length}</span>
             </div>
             {exerciseLog.slice(-2).map((ex) => (
               <div key={ex.id} className="text-sm border-l-2 border-orange-400 pl-3">
                 <p className="font-medium text-slate-900">{ex.type}</p>
                 <p className="text-slate-500">{ex.durationMinutes} min • {ex.intensity}</p>
               </div>
             ))}
             {exerciseLog.length === 0 && (
               <p className="text-sm text-slate-400 italic">No workouts logged yet.</p>
             )}
          </div>
        </div>

        {/* Sleep & Recovery */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Moon size={20} className="text-indigo-500" /> Sleep & Recovery
          </h3>
          {sleepLog ? (
            <div className="space-y-6">
              <div className="flex justify-between text-center">
                 <div>
                   <div className="text-3xl font-bold text-indigo-600">{sleepLog.durationHours}h</div>
                   <div className="text-xs text-slate-500">{sleepLog.bedTime} - {sleepLog.wakeTime}</div>
                 </div>
                 <div>
                   <div className="text-xl font-bold text-indigo-600 mt-2">{sleepLog.quality}</div>
                   <div className="text-xs text-slate-500">Quality</div>
                 </div>
              </div>
              {sleepLog.dreamDescription && (
                <div className="bg-indigo-50 p-4 rounded-lg text-sm">
                   <p className="font-semibold text-indigo-800 mb-1">Dream Insight</p>
                   <p className="text-indigo-700 italic line-clamp-3">"{sleepLog.dreamAnalysis}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-slate-400 pb-8">
              <Moon size={32} className="mb-2 opacity-50" />
              <p>No sleep data.</p>
            </div>
          )}
        </div>

      </div>

      {/* Ask the Health Team Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                  <MessageSquare size={24} />
              </div>
              <div>
                  <h2 className="text-xl font-bold">Ask the Health Team</h2>
                  <p className="text-teal-100 text-sm">Our collaborative agents are ready to answer based on your daily logs.</p>
              </div>
          </div>
          
          <div className="space-y-4">
              <div className="flex gap-2">
                  <input 
                      type="text" 
                      value={teamQuestion}
                      onChange={(e) => setTeamQuestion(e.target.value)}
                      placeholder="e.g. Should I exercise today given my bad sleep?"
                      onKeyDown={(e) => e.key === 'Enter' && handleAskTeam()}
                      className="flex-1 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button 
                      onClick={handleAskTeam}
                      disabled={askingTeam || !teamQuestion}
                      className="bg-white text-teal-700 px-4 rounded-xl font-bold hover:bg-teal-50 disabled:opacity-50 transition-colors"
                  >
                      {askingTeam ? <Brain className="animate-bounce" /> : <Send />}
                  </button>
              </div>
              
              {teamAnswer && (
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 animate-in fade-in slide-in-from-top-2">
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{teamAnswer}</ReactMarkdown>
                      </div>
                  </div>
              )}
          </div>
      </section>

      {/* Consensus Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-white p-4 md:p-6 border-b border-indigo-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-bold text-indigo-900 flex items-center gap-2">
                <Brain className="text-indigo-600" />
                Daily Consensus
              </h2>
              <button 
                onClick={triggerSynthesis}
                disabled={isSynthesizing}
                className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1.5 rounded-full font-bold transition-colors disabled:opacity-50"
              >
                  {isSynthesizing ? "Meeting..." : "Run Meeting"}
              </button>
          </div>

          <button 
            onClick={handleEndDay} 
            className={`text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
                dayEnded 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            {dayEnded ? (
                <>
                    <Check size={16} /> Saved to Profile
                </>
            ) : (
                <>
                    <Archive size={16}/> End Day & Save Records
                </>
            )}
          </button>
        </div>
        <div className="p-4 md:p-6 min-h-[120px]">
          {dailyConsensus ? (
             <div className="prose prose-indigo max-w-none text-sm md:text-base text-slate-700">
               <ReactMarkdown>{dailyConsensus}</ReactMarkdown>
             </div>
          ) : (
            <div className="text-center text-slate-400 py-8 flex flex-col items-center">
              <Sparkles size={32} className="mb-4 text-slate-200" />
              <p className="text-sm">Log your data, then click "Run Meeting" to generate summary.</p>
            </div>
          )}
        </div>
      </section>

      {/* History Section */}
      {history.length > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
             <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50">
                 <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                     <Calendar size={20} className="text-slate-500"/> Previous Days
                 </h2>
             </div>
             <div className="divide-y divide-slate-100">
                 {history.slice(0, 3).map((entry, idx) => (
                     <div key={idx} className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                         <div className="flex justify-between items-center mb-2">
                             <div className="font-bold text-slate-800">{entry.date}</div>
                             <div className="flex gap-3 text-xs md:text-sm text-slate-500">
                                 <span>{entry.caloriesIn} kcal in</span>
                                 <span>{entry.caloriesBurned} kcal out</span>
                                 {entry.mood && <span>Mood: {entry.mood}</span>}
                             </div>
                         </div>
                         <div className="prose prose-sm max-w-none text-slate-600 line-clamp-2 hover:line-clamp-none cursor-pointer">
                             <ReactMarkdown>{entry.consensus}</ReactMarkdown>
                         </div>
                     </div>
                 ))}
                 {history.length > 3 && (
                     <div className="p-4 text-center bg-slate-50 text-slate-500 text-sm">
                         View all {history.length} records in your Profile.
                     </div>
                 )}
             </div>
        </section>
      )}
    </div>
  );
};

export default DashboardView;
