import React, { useState, useRef } from 'react';
import { useHealth } from '../store';
import { analyzeFoodImage, analyzeFoodText } from '../geminiService';
import { Camera, Upload, Check, Loader2, Plus, Ruler, Weight, Type, Save, Utensils } from 'lucide-react';
import { FoodEntry } from '../types';

const DietitianView: React.FC = () => {
  const { addFood, foodLog, profile, updateProfile } = useHealth();
  const [analyzing, setAnalyzing] = useState(false);
  
  // Image State
  const [preview, setPreview] = useState<string | null>(null);
  
  // Text State
  const [textInput, setTextInput] = useState('');
  const [mode, setMode] = useState<'image' | 'text'>('image');

  // Stats State
  const [localHeight, setLocalHeight] = useState(profile.height?.toString() || '');
  const [localWeight, setLocalWeight] = useState(profile.weight?.toString() || '');
  const [statsSaved, setStatsSaved] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<Partial<FoodEntry> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setAnalysisResult(null);
        setMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      if (mode === 'image' && preview) {
          const base64 = preview.split(',')[1];
          const result = await analyzeFoodImage(base64);
          setAnalysisResult(result);
      } else if (mode === 'text' && textInput) {
          const result = await analyzeFoodText(textInput);
          setAnalysisResult(result);
      }
    } catch (error) {
      alert("Failed to analyze food. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (analysisResult && analysisResult.name) {
      addFood({
        id: Date.now().toString(),
        timestamp: new Date(),
        imageUrl: preview || undefined,
        name: analysisResult.name || 'Unknown',
        calories: analysisResult.calories || 0,
        protein: analysisResult.protein || 0,
        carbs: analysisResult.carbs || 0,
        fats: analysisResult.fats || 0,
        notes: analysisResult.notes
      });
      setPreview(null);
      setTextInput('');
      setAnalysisResult(null);
    }
  };

  const handleSaveStats = () => {
      updateProfile({
          height: localHeight ? parseInt(localHeight) : undefined,
          weight: localWeight ? parseInt(localWeight) : undefined
      });
      setStatsSaved(true);
      setTimeout(() => setStatsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6 grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="space-y-6">
        
        {/* Quick Stats Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-end gap-4">
            <div className="flex-1">
                <label className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Ruler size={12}/> Height (cm)</label>
                <input 
                    type="number" 
                    value={localHeight}
                    onChange={(e) => setLocalHeight(e.target.value)}
                    placeholder="--"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-sm font-bold text-slate-800 focus:outline-teal-500"
                />
            </div>
            <div className="flex-1">
                <label className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Weight size={12}/> Weight (kg)</label>
                <input 
                    type="number" 
                    value={localWeight}
                    onChange={(e) => setLocalWeight(e.target.value)}
                    placeholder="--"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-sm font-bold text-slate-800 focus:outline-teal-500"
                />
            </div>
            <button 
                onClick={handleSaveStats}
                className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
                title="Save Stats"
            >
                {statsSaved ? <Check size={18}/> : <Save size={18}/>}
            </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Utensils className="text-teal-600" />
                Dietitian
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setMode('image')}
                    className={`p-1.5 rounded-md transition-all ${mode === 'image' ? 'bg-white shadow text-teal-600' : 'text-slate-400'}`}
                >
                    <Camera size={18} />
                </button>
                <button 
                    onClick={() => setMode('text')}
                    className={`p-1.5 rounded-md transition-all ${mode === 'text' ? 'bg-white shadow text-teal-600' : 'text-slate-400'}`}
                >
                    <Type size={18} />
                </button>
            </div>
          </div>

          <p className="text-slate-500 mb-6 text-sm">
              {mode === 'image' ? "Upload a meal photo to analyze nutrition." : "Describe your meal in detail."}
          </p>
          
          {mode === 'image' ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                preview ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
                }`}
            >
                {preview ? (
                <img src={preview} alt="Food" className="h-full w-full object-contain rounded-lg p-2" />
                ) : (
                <div className="text-center text-slate-400">
                    <Upload size={48} className="mx-auto mb-2" />
                    <p>Click to upload meal photo</p>
                </div>
                )}
                <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileSelect} 
                />
            </div>
          ) : (
             <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g. A bowl of oatmeal with blueberries and honey, and a black coffee."
                className="w-full h-56 border border-slate-200 rounded-xl p-4 resize-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 outline-none"
             />
          )}
          

          {(preview || (mode === 'text' && textInput)) && !analysisResult && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full mt-4 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-slate-300 flex justify-center items-center gap-2"
            >
              {analyzing ? <Loader2 className="animate-spin" /> : <SparklesIcon />}
              {analyzing ? "Dietitian is thinking..." : "Analyze Meal"}
            </button>
          )}
        </div>

        {/* Results Card */}
        {analysisResult && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-teal-100 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Dietitian's Report</h3>
            <div className="space-y-3 mb-6">
               <div className="flex justify-between border-b border-slate-100 pb-2">
                 <span className="text-slate-500">Identified</span>
                 <span className="font-medium text-slate-900">{analysisResult.name}</span>
               </div>
               <div className="flex justify-between border-b border-slate-100 pb-2">
                 <span className="text-slate-500">Calories</span>
                 <span className="font-bold text-slate-900">{analysisResult.calories} kcal</span>
               </div>
               <div className="grid grid-cols-3 gap-2 text-center text-sm pt-2">
                 <div className="bg-blue-50 p-2 rounded text-blue-700">
                   <div className="font-bold">{analysisResult.protein}g</div>
                   <div className="text-xs">Protein</div>
                 </div>
                 <div className="bg-green-50 p-2 rounded text-green-700">
                   <div className="font-bold">{analysisResult.carbs}g</div>
                   <div className="text-xs">Carbs</div>
                 </div>
                 <div className="bg-orange-50 p-2 rounded text-orange-700">
                   <div className="font-bold">{analysisResult.fats}g</div>
                   <div className="text-xs">Fats</div>
                 </div>
               </div>
               {analysisResult.notes && (
                 <p className="text-sm text-slate-500 italic mt-2 bg-slate-50 p-3 rounded">
                   "{analysisResult.notes}"
                 </p>
               )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleSave}
                className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700"
              >
                Log Meal
              </button>
              <button 
                onClick={() => { setPreview(null); setAnalysisResult(null); setTextInput(''); }}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700">Today's Logs</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {foodLog.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">
              <p>No meals logged today.</p>
            </div>
          ) : (
            foodLog.map((food) => (
              <div key={food.id} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                {food.imageUrl ? (
                  <img src={food.imageUrl} alt={food.name} className="w-16 h-16 object-cover rounded-md" />
                ) : (
                  <div className="w-16 h-16 bg-slate-200 rounded-md flex items-center justify-center text-slate-400 shrink-0">
                    <UtensilsIcon />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-slate-900">{food.name}</h4>
                  <p className="text-sm text-slate-500">{food.calories} kcal • P: {food.protein}g</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(food.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const UtensilsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;

export default DietitianView;