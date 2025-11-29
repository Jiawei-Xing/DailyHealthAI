
// Data Models

export enum AgentType {
  DIETITIAN = 'DIETITIAN',
  PHYSICAL = 'PHYSICAL',
  SLEEP = 'SLEEP',
  COUNSELOR = 'COUNSELOR',
  MEDICAL = 'MEDICAL',
  COORDINATOR = 'COORDINATOR'
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: Date;
  imageUrl?: string;
  notes?: string;
}

export interface ExerciseEntry {
  id: string;
  type: string;
  durationMinutes: number;
  intensity: 'Low' | 'Medium' | 'High';
  caloriesBurned: number;
  timestamp: Date;
  notes?: string;
}

export type SleepQuality = 'Poor' | 'Fair' | 'Good' | 'Excellent';

export interface SleepEntry {
  date: string;
  bedTime: string; // HH:mm
  wakeTime: string; // HH:mm
  durationHours: number;
  quality: SleepQuality;
  dreamDescription?: string;
  dreamAnalysis?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other' | '';
  height?: number; // cm
  weight?: number; // kg
  goals: string[];
  medicalHistory: string; // Static long-term context
  geneticRisks?: string;
  concerns?: string[];
}

export interface DailySummary {
  date: string;
  consensus: string;
  caloriesIn: number;
  caloriesBurned: number;
  mood: string | null;
  details?: string; // Text summary for quick view
  foodLog?: FoodEntry[]; // Full record
  exerciseLog?: ExerciseEntry[]; // Full record
  sleepLog?: SleepEntry | null; // Full record
}

export interface AppState {
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  daysActive: number; // Streak
  profile: UserProfile;
  foodLog: FoodEntry[];
  exerciseLog: ExerciseEntry[];
  sleepLog: SleepEntry | null;
  chatHistory: ChatMessage[];
  currentEmotion: string | null;
  dailyConsensus: string | null;
  history: DailySummary[];
  isSynthesizing: boolean;
}

export type ViewState = 'AUTH' | 'ONBOARDING' | 'DASHBOARD' | 'DIETITIAN' | 'PHYSICAL' | 'SLEEP' | 'COUNSELOR' | 'MEDICAL' | 'PROFILE';
