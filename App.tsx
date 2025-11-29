import React, { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from './store';
import { ViewState } from './types';
import { 
  Activity, 
  Utensils, 
  Moon, 
  MessageCircleHeart, 
  LayoutDashboard, 
  UserCircle,
  Stethoscope,
  BicepsFlexed
} from 'lucide-react';

// Sub-components
import DashboardView from './components/DashboardView';
import DietitianView from './components/DietitianView';
import PhysicalView from './components/PhysicalView';
import SleepView from './components/SleepView';
import CounselorView from './components/CounselorView';
import AuthView from './components/AuthView';
import OnboardingView from './components/OnboardingView';
import MedicalView from './components/MedicalView';
import ProfileView from './components/ProfileView';

const NavigationItem: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-teal-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-teal-700'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const MainContent: React.FC<{ view: ViewState }> = ({ view }) => {
  switch (view) {
    case 'DASHBOARD': return <DashboardView />;
    case 'DIETITIAN': return <DietitianView />;
    case 'PHYSICAL': return <PhysicalView />;
    case 'SLEEP': return <SleepView />;
    case 'COUNSELOR': return <CounselorView />;
    case 'MEDICAL': return <MedicalView />;
    case 'PROFILE': return <ProfileView />;
    default: return <DashboardView />;
  }
};

const AppShell: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const { profile, isAuthenticated, onboardingComplete } = useHealth();

  if (!isAuthenticated) return <AuthView />;
  if (!onboardingComplete) return <OnboardingView />;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-2 text-teal-600">
           <Activity size={24} strokeWidth={2.5} />
           <span className="font-bold text-lg">DailyHealth AI</span>
        </div>
        <button onClick={() => setCurrentView('PROFILE')}>
           <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm border border-teal-200">
              {profile.name[0]}
           </div>
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-teal-600">
            <Activity size={28} strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight">DailyHealth AI</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Holistic AI Ecosystem</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavigationItem 
            active={currentView === 'DASHBOARD'} 
            onClick={() => setCurrentView('DASHBOARD')} 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
          />
          <div className="pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Agents</div>
          <NavigationItem 
            active={currentView === 'DIETITIAN'} 
            onClick={() => setCurrentView('DIETITIAN')} 
            icon={<Utensils size={20} />} 
            label="Dietitian" 
          />
          <NavigationItem 
            active={currentView === 'PHYSICAL'} 
            onClick={() => setCurrentView('PHYSICAL')} 
            icon={<BicepsFlexed size={20} />} 
            label="Trainer" 
          />
          <NavigationItem 
            active={currentView === 'SLEEP'} 
            onClick={() => setCurrentView('SLEEP')} 
            icon={<Moon size={20} />} 
            label="Sleep Specialist" 
          />
          <NavigationItem 
            active={currentView === 'COUNSELOR'} 
            onClick={() => setCurrentView('COUNSELOR')} 
            icon={<MessageCircleHeart size={20} />} 
            label="Counselor" 
          />
           <NavigationItem 
            active={currentView === 'MEDICAL'} 
            onClick={() => setCurrentView('MEDICAL')} 
            icon={<Stethoscope size={20} />} 
            label="Medical" 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
             onClick={() => setCurrentView('PROFILE')}
             className="flex items-center space-x-3 text-slate-600 hover:text-teal-700 w-full"
           >
             <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold uppercase">
               {profile.name[0]}
             </div>
             <div className="text-sm text-left">
               <p className="font-medium text-slate-900">{profile.name}</p>
               <p className="text-xs text-slate-400">View Profile</p>
             </div>
           </button>
        </div>
      </aside>

      {/* Mobile Nav (Bottom Fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={() => setCurrentView('DASHBOARD')} className={`p-2 rounded-full ${currentView === 'DASHBOARD' ? 'text-teal-600 bg-teal-50' : 'text-slate-400'}`}><LayoutDashboard size={24} /></button>
        <button onClick={() => setCurrentView('DIETITIAN')} className={`p-2 rounded-full ${currentView === 'DIETITIAN' ? 'text-teal-600 bg-teal-50' : 'text-slate-400'}`}><Utensils size={24} /></button>
        <button onClick={() => setCurrentView('PHYSICAL')} className={`p-2 rounded-full ${currentView === 'PHYSICAL' ? 'text-teal-600 bg-teal-50' : 'text-slate-400'}`}><BicepsFlexed size={24} /></button>
        <button onClick={() => setCurrentView('SLEEP')} className={`p-2 rounded-full ${currentView === 'SLEEP' ? 'text-teal-600 bg-teal-50' : 'text-slate-400'}`}><Moon size={24} /></button>
        <button onClick={() => setCurrentView('COUNSELOR')} className={`p-2 rounded-full ${currentView === 'COUNSELOR' ? 'text-teal-600 bg-teal-50' : 'text-slate-400'}`}><MessageCircleHeart size={24} /></button>
        <button onClick={() => setCurrentView('MEDICAL')} className={`p-2 rounded-full ${currentView === 'MEDICAL' ? 'text-teal-600 bg-teal-50' : 'text-slate-400'}`}><Stethoscope size={24} /></button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full pb-20 md:pb-0">
        <MainContent view={currentView} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HealthProvider>
      <AppShell />
    </HealthProvider>
  );
};

export default App;