
import React from 'react';
import { useHealth } from '../store';
import { Activity, Mail } from 'lucide-react';

const AuthView: React.FC = () => {
  const { login } = useHealth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-200 transform rotate-3">
             <Activity size={32} strokeWidth={3} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">DailyHealth AI</h1>
        <p className="text-slate-500 mb-8">Your holistic health ecosystem.</p>

        <div className="space-y-4">
           <button 
             onClick={login}
             className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors"
           >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.318 13.714v5.484h9.078c-0.381 2.935-3.353 5.156-5.96 5.859-2.421 0.651-6.176 0.28-8.293-1.662-3.051-2.796-2.919-8.498 0.163-11.458 1.638-1.571 3.968-2.31 6.136-2.029 1.838 0.239 3.327 1.134 4.545 2.22l-4.102 3.863c-0.573-0.457-1.332-0.814-2.091-0.78-1.516 0.068-2.937 1.346-3.155 2.87-0.231 1.613 0.941 3.316 2.553 3.582 1.319 0.218 2.768-0.395 3.312-1.632 0.358-0.812 0.322-1.724 0.090-2.584h-4.331z"/></svg>
              Sign in with Apple
           </button>
           <button 
             onClick={login}
             className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors"
           >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
           </button>
           <button 
             onClick={login}
             className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors"
           >
              <Mail size={20} className="text-slate-400"/>
              Continue with Email
           </button>
        </div>
        
        <p className="mt-8 text-xs text-slate-400">By continuing, you agree to our Terms of Service.</p>
      </div>
    </div>
  );
};

export default AuthView;
