import React, { useState } from 'react';
import { Heart, BookOpen, Music, Coffee, Star, RefreshCw } from 'lucide-react';
import { useEmotion } from '../contexts/EmotionContext';
import { getSuggestions } from '../utils/suggestionEngine';
import { getEmotionColor, getEmotionIcon } from '../utils/emotionUtils';

const SuggestionPanel: React.FC = () => {
  const { currentEmotion, emotionHistory } = useEmotion();
  const [refreshKey, setRefreshKey] = useState(0);

  const suggestions = getSuggestions(currentEmotion?.emotion || 'neutral');
  
  const refreshSuggestions = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Calculate recent mood pattern
  const recentEmotions = emotionHistory.slice(0, 5);
  const moodPattern = recentEmotions.map(e => e.emotion);
  const isPositiveTrend = recentEmotions.length > 2 && 
    recentEmotions.slice(0, 2).every(e => ['happy', 'excited', 'relaxed'].includes(e.emotion));

  const categoryIcons = {
    breathing: Coffee,
    music: Music,
    reading: BookOpen,
    activity: Star,
    mindfulness: Heart
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mood Enhancement Suggestions</h1>
        <p className="text-lg text-gray-600">
          Personalized recommendations to improve your well-being
        </p>
      </div>

      {/* Current Mood Status */}
      {currentEmotion && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Current Mood</h2>
            <button
              onClick={refreshSuggestions}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${getEmotionColor(currentEmotion.emotion)} bg-opacity-20`}>
              {getEmotionIcon(currentEmotion.emotion, 'h-8 w-8')}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 capitalize">
                {currentEmotion.emotion}
              </h3>
              <p className="text-gray-600">
                Confidence: {currentEmotion.confidence}% • Detected just now
              </p>
              {isPositiveTrend && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  🎉 You're on a positive streak!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mood Pattern Insight */}
      {recentEmotions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Mood Pattern</h3>
          <div className="flex items-center space-x-2 mb-3">
            {moodPattern.slice(0, 5).map((emotion, index) => (
              <div key={index} className="flex items-center">
                <div className={`p-2 rounded-lg ${getEmotionColor(emotion)} bg-opacity-30`}>
                  {getEmotionIcon(emotion, 'h-4 w-4')}
                </div>
                {index < moodPattern.length - 1 && (
                  <div className="w-2 h-px bg-gray-300 mx-1" />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Based on your recent patterns, we've customized these suggestions for you.
          </p>
        </div>
      )}

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(suggestions).map(([category, items]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
          
          return (
            <div key={`${category}-${refreshKey}`} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {category}
                </h3>
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    {item.duration && (
                      <p className="text-xs text-blue-600 mt-2">⏱ {item.duration}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
        <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
          <Heart className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          You're Taking Great Care of Yourself!
        </h3>
        <p className="text-gray-600">
          Remember that every small step towards better emotional well-being counts. 
          You're doing amazing by being mindful of your emotions.
        </p>
      </div>

      {/* No Current Emotion State */}
      {!currentEmotion && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Record Your Voice to Get Personalized Suggestions
          </h3>
          <p className="text-gray-600 mb-6">
            Once you record and analyze your voice, we'll provide tailored recommendations 
            to help improve your mood and emotional well-being.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
            Go to Voice Recorder
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestionPanel;