import React, { useState } from 'react';
import { useHealth } from '../store';
import { calculateExerciseStats, generateWorkout } from '../geminiService';
import { Activity, BicepsFlexed, Play, Plus, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const PhysicalView: React.FC = () => {
  const { addExercise, exerciseLog, profile } = useHealth();
  
  // Log State
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState(30);
  const [calculating, setCalculating] = useState(false);

  // Generate State
  const [mood, setMood] = useState('Energetic');
  const [generatedWorkout, setGeneratedWorkout] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleLogActivity = async () => {
    if (!activityName) return;
    setCalculating(true);
    const stats = await calculateExerciseStats(activityName, duration);
    addExercise({
      id: Date.now().toString(),
      type: activityName,
      durationMinutes: duration,
      caloriesBurned: stats.caloriesBurned || 100,
      intensity: (stats.intensity as any) || 'Medium',
      timestamp: new Date()
    });
    setActivityName('');
    setCalculating(false);
  };

  const handleGenerateWorkout = async () => {
    setGenerating(true);
    const workout = await generateWorkout(profile, mood);
    setGeneratedWorkout(workout);
    setGenerating(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Column 1: Workout Generator */}
      <div className="space-y-6">
         <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-lg">
           <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
             <BicepsFlexed />
             AI Trainer
           </h2>
           <p className="opacity-90 mb-6">Need a plan? I'll build a custom workout based on how you feel right now.</p>
           
           <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm space-y-4">
              <div>
                <label className="text-sm font-medium opacity-80 mb-1 block">Current Vibe</label>
                <select 
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-white text-slate-800 p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option>Energetic</option>
                  <option>Tired</option>
                  <option>Stressed</option>
                  <option>Short on time</option>
                </select>
              </div>
              <button 
                onClick={handleGenerateWorkout}
                disabled={generating}
                className="w-full bg-white text-orange-600 font-bold py-3 rounded-lg hover:bg-orange-50 transition-colors flex justify-center items-center gap-2"
              >
                {generating ? "Designing Plan..." : "Generate Workout"}
                {!generating && <Play size={16} fill="currentColor" />}
              </button>
           </div>
         </div>

         {generatedWorkout && (
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Your Session</h3>
             <div className="prose prose-sm prose-orange max-w-none text-slate-600">
                <ReactMarkdown>{generatedWorkout}</ReactMarkdown>
             </div>
           </div>
         )}
      </div>

      {/* Column 2: Logger & History */}
      <div className="space-y-6">
        {/* Logger */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Log Activity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Activity Type</label>
              <input 
                type="text" 
                placeholder="e.g., Running, Yoga, HIIT"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Duration (minutes)</label>
              <input 
                type="range" 
                min="5" 
                max="120" 
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="text-right text-sm text-orange-600 font-bold">{duration} min</div>
            </div>
            <button 
              onClick={handleLogActivity}
              disabled={calculating || !activityName}
              className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {calculating ? "Calculating Intensity..." : "Log Exercise"}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Today's Movement</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {exerciseLog.length === 0 ? (
               <div className="p-8 text-center text-slate-400">No exercises logged yet.</div>
            ) : (
              exerciseLog.map((ex) => (
                <div key={ex.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{ex.type}</p>
                      <p className="text-xs text-slate-500">{ex.intensity} Intensity</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{ex.caloriesBurned} kcal</p>
                    <p className="text-xs text-slate-500">{ex.durationMinutes} min</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default PhysicalView;