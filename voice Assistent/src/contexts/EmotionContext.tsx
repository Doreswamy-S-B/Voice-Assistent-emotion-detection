import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  timestamp: string;
  audioUrl?: string;
}

interface EmotionContextType {
  currentEmotion: EmotionResult | null;
  emotionHistory: EmotionResult[];
  addEmotionResult: (emotion: EmotionResult) => void;
  clearHistory: () => void;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export function useEmotion() {
  const context = useContext(EmotionContext);
  if (context === undefined) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
}

interface EmotionProviderProps {
  children: ReactNode;
}

export function EmotionProvider({ children }: EmotionProviderProps) {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>(() => {
    const saved = localStorage.getItem('voicemood_emotions');
    return saved ? JSON.parse(saved) : [];
  });

  const addEmotionResult = (emotion: EmotionResult) => {
    setCurrentEmotion(emotion);
    const newHistory = [emotion, ...emotionHistory].slice(0, 50); // Keep last 50 results
    setEmotionHistory(newHistory);
    localStorage.setItem('voicemood_emotions', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setEmotionHistory([]);
    localStorage.removeItem('voicemood_emotions');
  };

  const value = {
    currentEmotion,
    emotionHistory,
    addEmotionResult,
    clearHistory
  };

  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  );
}