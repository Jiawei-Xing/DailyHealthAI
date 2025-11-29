import React, { useState } from 'react';
import { useHealth } from '../store';
import { ArrowRight, Check, Dna } from 'lucide-react';

const OnboardingView: React.FC = () => {
  const { completeOnboarding } = useHealth();
  const [step, setStep] = useState(1);
  
  const [data, setData] = useState({
    name: '',
    age: 30,
    gender: '' as 'Male' | 'Female' | 'Non-binary' | 'Other',
    goals: [] as string[],
    medicalHistory: '',
    geneticRisks: '',
    concerns: [] as string[],
  });

  const availableGoals = ["Lose Weight", "Build Muscle", "Sleep Better", "Reduce Stress", "Improve Endurance"];
  
  const toggleGoal = (goal: string) => {
    setData(prev => ({
        ...prev, 
        goals: prev.goals.includes(goal) 
            ? prev.goals.filter(g => g !== goal) 
            : [...prev.goals, goal]
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const finish = () => completeOnboarding(data);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-lg bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100">
          <div className="mb-6 flex justify-between items-center">
             <span className="text-teal-600 font-bold uppercase tracking-widest text-xs">Step {step} of 3</span>
             <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 w-8 rounded-full ${step >= i ? 'bg-teal-500' : 'bg-slate-200'}`} />
                ))}
             </div>
          </div>

          {step === 1 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                <h2 className="text-2xl font-bold text-slate-900">Let's get to know you.</h2>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                   <input 
                     type="text" 
                     className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none"
                     placeholder="Your name"
                     value={data.name}
                     onChange={e => setData({...data, name: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input 
                      type="number" 
                      className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none"
                      value={data.age}
                      onChange={e => setData({...data, age: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                      value={data.gender}
                      onChange={e => setData({...data, gender: e.target.value as any})}
                    >
                      <option value="" disabled>Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <button onClick={nextStep} disabled={!data.name || !data.gender} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50">Continue</button>
             </div>
          )}

          {step === 2 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                <h2 className="text-2xl font-bold text-slate-900">What are your goals?</h2>
                <div className="space-y-2">
                    {availableGoals.map(g => (
                        <button 
                          key={g}
                          onClick={() => toggleGoal(g)}
                          className={`w-full p-3 rounded-xl text-left flex justify-between items-center border transition-all ${
                             data.goals.includes(g) 
                                ? 'border-teal-500 bg-teal-50 text-teal-800' 
                                : 'border-slate-200 hover:border-teal-300'
                          }`}
                        >
                            {g}
                            {data.goals.includes(g) && <Check size={18} />}
                        </button>
                    ))}
                </div>
                <button onClick={nextStep} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold mt-4">Continue</button>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                <h2 className="text-2xl font-bold text-slate-900">Medical Background</h2>
                <p className="text-slate-500 text-sm">To give safe advice, the agents need to know your history.</p>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medical Conditions</label>
                  <textarea 
                    className="w-full h-24 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                    placeholder="e.g. Asthma, Diabetes, Allergies..."
                    value={data.medicalHistory}
                    onChange={e => setData({...data, medicalHistory: e.target.value})}
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                     <Dna size={16} /> Family History / Genetics
                   </label>
                   <textarea 
                     className="w-full h-24 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                     placeholder="e.g. Family history of heart disease..."
                     value={data.geneticRisks}
                     onChange={e => setData({...data, geneticRisks: e.target.value})}
                   />
                </div>

                <button onClick={finish} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2">
                    Get Started <ArrowRight size={18} />
                </button>
             </div>
          )}
       </div>
    </div>
  );
};

export default OnboardingView;