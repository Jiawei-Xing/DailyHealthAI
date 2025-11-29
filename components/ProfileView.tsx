import React, { useState } from 'react';
import { useHealth } from '../store';
import { UserCircle, Save, Dna, Calendar, History, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ProfileView: React.FC = () => {
  const { profile, updateProfile, history } = useHealth();
  const [formData, setFormData] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const handleSave = () => {
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6 space-y-6">
       
       {/* Profile Header */}
       <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-slate-100 p-4 rounded-full">
            <UserCircle size={64} className="text-slate-400" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-slate-500 text-sm">Member since {new Date().getFullYear()}</p>
            <div className="flex gap-2 justify-center md:justify-start mt-2">
                 {profile.goals.map((g, i) => (
                     <span key={i} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-medium">{g}</span>
                 ))}
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
           {/* Edit Profile Form */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Edit Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value as any})}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 175"
                      value={formData.height || ''}
                      onChange={e => setFormData({...formData, height: parseInt(e.target.value)})}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 70"
                      value={formData.weight || ''}
                      onChange={e => setFormData({...formData, weight: parseInt(e.target.value)})}
                      className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Medical Conditions</label>
                 <textarea 
                    value={formData.medicalHistory}
                    onChange={e => setFormData({...formData, medicalHistory: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2.5 h-24 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                 />
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Dna size={16}/> Genetic Risks / Family History
                 </label>
                 <textarea 
                    value={formData.geneticRisks}
                    onChange={e => setFormData({...formData, geneticRisks: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2.5 h-24 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                 />
              </div>

              <button 
                 onClick={handleSave}
                 className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                 {saved ? "Saved Changes" : "Save Profile"}
                 {saved && <Save size={18} />}
              </button>
           </div>

           {/* History / Records */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
               <div 
                className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setShowHistory(!showHistory)}
               >
                   <div className="flex items-center gap-2 font-bold text-slate-800">
                       <History size={20} className="text-teal-600"/>
                       Past Records ({history.length})
                   </div>
                   {showHistory ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
               </div>
               
               {showHistory && (
                   <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                       {history.length === 0 ? (
                           <div className="p-8 text-center text-slate-400">
                               <Calendar size={32} className="mx-auto mb-2 opacity-50"/>
                               <p>No days archived yet.</p>
                               <p className="text-xs mt-1">Complete a day on the dashboard to save it here.</p>
                           </div>
                       ) : (
                           history.map((day, idx) => (
                               <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                                   <div className="flex justify-between items-start mb-3">
                                       <div>
                                           <h4 className="font-bold text-slate-900">{day.date}</h4>
                                           <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                               {day.mood && <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">Mood: {day.mood}</span>}
                                               <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{day.caloriesIn} kcal</span>
                                           </div>
                                       </div>
                                   </div>
                                   
                                   {/* Details Summary */}
                                   {day.details && (
                                       <div className="mb-3 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                                           {day.details}
                                       </div>
                                   )}

                                   <div className="prose prose-sm max-w-none text-slate-600 line-clamp-4 hover:line-clamp-none">
                                       <ReactMarkdown>{day.consensus}</ReactMarkdown>
                                   </div>
                               </div>
                           ))
                       )}
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};

export default ProfileView;