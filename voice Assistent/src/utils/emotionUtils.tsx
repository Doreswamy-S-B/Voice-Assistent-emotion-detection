import React from 'react';
import { Smile, Frown, Angry, Zap, Sunrise as Surprise, Meh, X, HelpCircle, Coffee, Star } from 'lucide-react';

export const emotions = [
  'happy', 'sad', 'angry', 'fearful', 'surprised', 
  'neutral', 'disgusted', 'confused', 'relaxed', 'excited'
];

export const getEmotionColor = (emotion: string): string => {
  const colors = {
    happy: 'text-yellow-600',
    sad: 'text-blue-600',
    angry: 'text-red-600',
    fearful: 'text-purple-600',
    surprised: 'text-orange-600',
    neutral: 'text-gray-600',
    disgusted: 'text-green-600',
    confused: 'text-indigo-600',
    relaxed: 'text-teal-600',
    excited: 'text-pink-600'
  };
  return colors[emotion as keyof typeof colors] || colors.neutral;
};

export const getEmotionIcon = (emotion: string, className: string = 'h-6 w-6') => {
  const iconProps = { className: `${className} ${getEmotionColor(emotion)}` };
  
  const icons = {
    happy: <Smile {...iconProps} />,
    sad: <Frown {...iconProps} />,
    angry: <Angry {...iconProps} />,
    fearful: <Zap {...iconProps} />,
    surprised: <Surprise {...iconProps} />,
    neutral: <Meh {...iconProps} />,
    disgusted: <X {...iconProps} />,
    confused: <HelpCircle {...iconProps} />,
    relaxed: <Coffee {...iconProps} />,
    excited: <Star {...iconProps} />
  };
  
  return icons[emotion as keyof typeof icons] || icons.neutral;
};

export const getEmotionDescription = (emotion: string): string => {
  const descriptions = {
    happy: 'Feeling joyful and content',
    sad: 'Experiencing sadness or melancholy',
    angry: 'Feeling frustrated or irritated',
    fearful: 'Experiencing anxiety or worry',
    surprised: 'Feeling amazed or startled',
    neutral: 'Balanced emotional state',
    disgusted: 'Feeling repulsed or revolted',
    confused: 'Feeling uncertain or puzzled',
    relaxed: 'Feeling calm and peaceful',
    excited: 'Feeling energetic and enthusiastic'
  };
  return descriptions[emotion as keyof typeof descriptions] || descriptions.neutral;
};