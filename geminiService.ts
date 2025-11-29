import { GoogleGenAI, Type } from "@google/genai";
import { AppState, ExerciseEntry, FoodEntry, SleepEntry, UserProfile } from "./types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Dietitian Agent ---
export const analyzeFoodImage = async (base64Image: string): Promise<Partial<FoodEntry>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze this food image. Estimate the name, calories, protein (g), carbs (g), and fats (g). Return strictly JSON." }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
            notes: { type: Type.STRING, description: "Brief healthy observation" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Dietitian Error:", error);
    throw error;
  }
};

export const analyzeFoodText = async (description: string): Promise<Partial<FoodEntry>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this food description: "${description}". Estimate the name, calories, protein (g), carbs (g), and fats (g). Return strictly JSON.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
            notes: { type: Type.STRING, description: "Brief healthy observation" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Dietitian Text Error:", error);
    throw error;
  }
};

// --- Physical Agent ---
export const generateWorkout = async (profile: UserProfile, mood: string): Promise<string> => {
  try {
    const context = `User: ${profile.age}yo, ${profile.gender}. History: ${profile.medicalHistory}. Goals: ${profile.goals.join(', ')}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Design a quick 20-minute home workout for this user. Context: ${context}. Current Mood: ${mood}. Ensure exercises are safe for their medical history. Format as a clear list.`,
    });
    return response.text || "Could not generate workout.";
  } catch (error) {
    console.error("Trainer Error:", error);
    return "Error generating workout.";
  }
};

export const calculateExerciseStats = async (description: string, duration: number): Promise<Partial<ExerciseEntry>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Calculate estimated calories burned for: "${description}" performed for ${duration} minutes. Return JSON.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caloriesBurned: { type: Type.NUMBER },
            intensity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
          }
        }
      }
    });
    if (response.text) return JSON.parse(response.text);
    throw new Error("No data");
  } catch (e) {
    console.error(e);
    return { caloriesBurned: 100, intensity: 'Medium' };
  }
};

// --- Sleep Agent ---
export const analyzeDream = async (dreamText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a Jungian dream analyst. Briefly interpret this dream: "${dreamText}". Keep it under 100 words.`,
    });
    return response.text || "No interpretation available.";
  } catch (e) {
    return "Could not interpret dream.";
  }
};

// --- Counseling Agent ---
export const chatWithCounselor = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: "You are a compassionate, empathetic mental health counselor agent. Keep responses concise, warm, and supportive. Do not give medical prescriptions.",
      }
    });
    const result = await chat.sendMessage({ message });
    return result.text || "...";
  } catch (e) {
    console.error(e);
    return "I am having trouble connecting right now. Please try again.";
  }
};

export const generateJournalEntry = async (chatHistory: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on this chat history, write a reflective daily journal entry from the user's perspective. Capture the key emotions and thoughts discussed. \n\n Chat: ${chatHistory}`,
    });
    return response.text || "Could not generate journal.";
  } catch (e) {
    return "Error generating journal.";
  }
};

// --- Medical Agent ---
export const consultMedicalAgent = async (profile: UserProfile, question: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for medical reasoning
      contents: `
        You are an AI Medical Assistant. 
        User Context: 
        - Age: ${profile.age}
        - Gender: ${profile.gender}
        - Medical History: ${profile.medicalHistory}
        - Genetic Risks: ${profile.geneticRisks}
        - Goals: ${profile.goals.join(', ')}

        User Question: ${question}

        Provide a safe, informative, and personalized answer based on their history. 
        DISCLAIMER: Always start by stating you are an AI and this is not professional medical advice.
      `
    });
    return response.text || "Unable to consult at this time.";
  } catch (error) {
    console.error("Medical Agent Error:", error);
    return "Medical agent is currently unavailable.";
  }
};

export const analyzeMedicalResult = async (base64Image: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Using Pro for complex document analysis
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: "Analyze this medical test result or document. Provide a concise, factual summary of the KEY FINDINGS suitable for saving to a medical record. Do not use conversational filler (e.g. 'Here is the analysis', 'The image shows'). Start directly with the clinical facts." }
          ]
        }
      });
      return response.text || "Could not analyze the document.";
    } catch (error) {
      console.error("Medical Analysis Error:", error);
      return "Error analyzing medical document.";
    }
  };

// --- The Coordinator (Agent Meeting) ---
export const synthesizeDailyReport = async (state: AppState): Promise<string> => {
  try {
    // Summarize recent history for context
    const recentHistory = state.history.slice(0, 3).map(h => 
        `- ${h.date}: ${h.mood || 'Neutral'} (${h.caloriesIn - h.caloriesBurned} net kcal)\n  Details: ${h.details || 'No details'}`
    ).join('\n');

    const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const prompt = `
      Act as a Lead Health Coordinator conducting a daily board meeting for DailyHealth AI.
      
      User Profile: ${state.profile.name}, ${state.profile.age}yo ${state.profile.gender}.
      Medical Context (Long-term Memory): ${state.profile.medicalHistory}
      Genetic Risks: ${state.profile.geneticRisks}
      
      Recent Days Context (Short-term Memory):
      ${recentHistory || "No previous history recorded."}

      Review the data from the specialist agents TODAY:
      1. **Dietitian Report**: ${state.foodLog.map(f => `${f.name} (${f.calories}kcal, P:${f.protein}g)`).join(', ') || "No food logged"}
      2. **Physical Report**: ${state.exerciseLog.map(e => `${e.type} (${e.durationMinutes}min, ${e.intensity})`).join(', ') || "No exercise logged"}
      3. **Sleep Report**: ${state.sleepLog ? `${state.sleepLog.durationHours}hrs, Quality: ${state.sleepLog.quality}` : "No sleep logged"}
      4. **Mental Health**: Current Emotion: ${state.currentEmotion || "Not recorded"}.
      
      Task:
      Synthesize this information into a cohesive "Daily Health Board Meeting Summary".
      
      CRITICAL: You must include a "Medical Specialist" perspective in the meeting.
      
      Structure the response as follows:
      
      **Meeting Minutes: Daily Health Board Review**
      **Date:** ${today}
      **Attendees:** Lead Coordinator, Dietitian, Trainer, Sleep Specialist, Counselor, *Medical Specialist*

      **1. Executive Summary**
      (A brief holistic overview of the day).

      **2. Specialist Insights & Medical Cross-Check**
      - **Medical Specialist**: Analyze today's logs against the user's Medical History and Genetic Risks. Are there any contraindications? (e.g., High sugar intake vs Diabetes risk, or High Intensity Cardio vs Heart condition). References specific past memory if relevant.
      - **Diet & Activity**: How did nutrition fuel movement today?
      - **Rest & Recovery**: Is sleep supporting the user's goals?

      **3. Strategy for Tomorrow**
      - Bullet point 1
      - Bullet point 2
      - Bullet point 3
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate consensus.";
  } catch (error) {
    console.error("Synthesis Error:", error);
    return "The agents could not meet at this time.";
  }
};

export const askCoordinator = async (state: AppState, question: string): Promise<string> => {
  try {
    const prompt = `
      You are the Health Team Coordinator.
      
      User: ${state.profile.name}.
      Logs Today:
      - Food: ${state.foodLog.length} items (${state.foodLog.reduce((a,b)=>a+b.calories,0)} kcal)
      - Exercise: ${state.exerciseLog.length} items
      - Sleep: ${state.sleepLog ? state.sleepLog.quality : "Unknown"}
      - Medical History: ${state.profile.medicalHistory}
      - Current Mood: ${state.currentEmotion}

      User Question: "${question}"

      Answer as the team representative. Consult the data above. Be helpful, concise, and collaborative.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });
    return response.text || "I couldn't reach the team right now.";
  } catch(e) {
      return "The team is currently offline.";
  }
};