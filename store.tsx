
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, FoodEntry, ExerciseEntry, SleepEntry, ChatMessage, UserProfile, DailySummary } from './types';
import { synthesizeDailyReport } from './geminiService';

interface HealthContextType extends AppState {
  login: () => void;
  completeOnboarding: (profileData: Partial<UserProfile>) => void;
  addFood: (food: FoodEntry) => void;
  addExercise: (exercise: ExerciseEntry) => void;
  setSleep: (sleep: SleepEntry) => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setEmotion: (emotion: string) => void;
  triggerSynthesis: () => Promise<void>;
  resetDay: () => void;
}

const defaultProfile: UserProfile = {
  name: "",
  age: 25,
  gender: "",
  goals: [],
  medicalHistory: "None",
  geneticRisks: "",
  concerns: [],
  height: undefined,
  weight: undefined
};

const defaultState: AppState = {
  isAuthenticated: false,
  onboardingComplete: false,
  daysActive: 1, // Mocked start
  profile: defaultProfile,
  foodLog: [],
  exerciseLog: [],
  sleepLog: null,
  chatHistory: [],
  currentEmotion: null,
  dailyConsensus: null,
  history: [],
  isSynthesizing: false,
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('myhealthagent_state_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({
            ...prev,
            ...parsed,
            // Ensure history exists if loading from old state
            history: parsed.history || []
        }));
      } catch (e) {
          console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('myhealthagent_state_v2', JSON.stringify(state));
  }, [state]);

  const login = () => {
    setState(prev => ({ ...prev, isAuthenticated: true }));
  };

  const completeOnboarding = (profileData: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileData },
      onboardingComplete: true
    }));
  };

  const addFood = (food: FoodEntry) => {
    setState(prev => ({ ...prev, foodLog: [...prev.foodLog, food] }));
  };

  const addExercise = (exercise: ExerciseEntry) => {
    setState(prev => ({ ...prev, exerciseLog: [...prev.exerciseLog, exercise] }));
  };

  const setSleep = (sleep: SleepEntry) => {
    setState(prev => ({ ...prev, sleepLog: sleep }));
  };

  const addChatMessage = (msg: ChatMessage) => {
    setState(prev => ({ ...prev, chatHistory: [...prev.chatHistory, msg] }));
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...profileUpdate } }));
  };

  const setEmotion = (emotion: string) => {
    setState(prev => ({ ...prev, currentEmotion: emotion }));
  };

  const triggerSynthesis = async () => {
    setState(prev => ({ ...prev, isSynthesizing: true }));
    const consensus = await synthesizeDailyReport(state);
    setState(prev => ({ ...prev, dailyConsensus: consensus, isSynthesizing: false }));
  };

  const resetDay = () => {
    setState(prev => {
        // Archive current day if there is data
        const newHistory = [...(prev.history || [])];
        
        // Check if there is anything worth saving
        const hasData = prev.dailyConsensus || prev.foodLog.length > 0 || prev.exerciseLog.length > 0 || prev.sleepLog;
        
        if (hasData) {
            // Create a text summary of specific items for "Deep Memory" and quick display
            const foodNames = prev.foodLog.map(f => f.name).join(', ') || 'None';
            const exerciseTypes = prev.exerciseLog.map(e => e.type).join(', ') || 'None';
            const sleepInfo = prev.sleepLog ? `${prev.sleepLog.durationHours}h (${prev.sleepLog.quality})` : 'None';
            const medHistoryLen = prev.profile.medicalHistory.length;
            
            const details = `[Diet: ${foodNames}] [Activity: ${exerciseTypes}] [Sleep: ${sleepInfo}] [Medical Context Len: ${medHistoryLen}]`;

            newHistory.unshift({
                date: new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                consensus: prev.dailyConsensus || "No meeting minutes generated for this day.",
                caloriesIn: prev.foodLog.reduce((a, b) => a + b.calories, 0),
                caloriesBurned: prev.exerciseLog.reduce((a, b) => a + b.caloriesBurned, 0),
                mood: prev.currentEmotion,
                details: details,
                foodLog: [...prev.foodLog],
                exerciseLog: [...prev.exerciseLog],
                sleepLog: prev.sleepLog ? { ...prev.sleepLog } : null
            });
        }

        console.log("Archiving day. New History length:", newHistory.length);

        return {
            ...prev,
            daysActive: prev.daysActive + 1,
            foodLog: [],
            exerciseLog: [],
            sleepLog: null,
            chatHistory: [], 
            currentEmotion: null,
            dailyConsensus: null,
            history: newHistory,
            isSynthesizing: false
        };
    });
  };

  return (
    <HealthContext.Provider value={{
      ...state,
      login,
      completeOnboarding,
      addFood,
      addExercise,
      setSleep,
      addChatMessage,
      updateProfile,
      setEmotion,
      triggerSynthesis,
      resetDay
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) throw new Error("useHealth must be used within a HealthProvider");
  return context;
};
