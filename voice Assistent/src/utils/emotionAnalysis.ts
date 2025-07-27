import { EmotionResult } from '../contexts/EmotionContext';
import { emotions } from './emotionUtils';

export const analyzeEmotion = (): EmotionResult => {
  // Simulate emotion detection with realistic patterns
  const emotionWeights = {
    happy: 20,
    neutral: 18,
    relaxed: 15,
    excited: 12,
    confused: 10,
    sad: 8,
    surprised: 6,
    fearful: 4,
    angry: 4,
    disgusted: 3
  };

  // Generate weighted random emotion
  const totalWeight = Object.values(emotionWeights).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  let selectedEmotion = 'neutral';
  for (const [emotion, weight] of Object.entries(emotionWeights)) {
    random -= weight;
    if (random <= 0) {
      selectedEmotion = emotion;
      break;
    }
  }

  // Generate confidence score (higher for common emotions)
  const baseConfidence = emotionWeights[selectedEmotion as keyof typeof emotionWeights] * 2;
  const randomVariation = (Math.random() - 0.5) * 20; // ±10%
  const confidence = Math.max(65, Math.min(95, baseConfidence + randomVariation));

  return {
    id: Date.now().toString(),
    emotion: selectedEmotion,
    confidence: Math.round(confidence),
    timestamp: new Date().toISOString()
  };
};

export const getEmotionTrend = (history: EmotionResult[]): 'improving' | 'declining' | 'stable' => {
  if (history.length < 3) return 'stable';

  const positiveEmotions = ['happy', 'excited', 'relaxed'];
  const recent = history.slice(0, 3);
  const positiveCount = recent.filter(e => positiveEmotions.includes(e.emotion)).length;

  if (positiveCount >= 2) return 'improving';
  if (positiveCount === 0) return 'declining';
  return 'stable';
};