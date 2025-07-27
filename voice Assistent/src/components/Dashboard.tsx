import React from 'react';
import { TrendingUp, Mic, Heart, Brain, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEmotion } from '../contexts/EmotionContext';
import { getEmotionColor, getEmotionIcon } from '../utils/emotionUtils';
import { format } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentEmotion, emotionHistory } = useEmotion();

  // Calculate stats
  const totalRecordings = emotionHistory.length;
  const todayRecordings = emotionHistory.filter(
    emotion => new Date(emotion.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const emotionCounts = emotionHistory.reduce((acc, emotion) => {
    acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentEmotion = Object.entries(emotionCounts).sort(([,a], [,b]) => b - a)[0];
  const averageConfidence = emotionHistory.length > 0 
    ? emotionHistory.reduce((sum, emotion) => sum + emotion.confidence, 0) / emotionHistory.length 
    : 0;

  const recentEmotions = emotionHistory.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 text-lg">
              Ready to explore your emotional journey today?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recordings</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecordings}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mic className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{todayRecordings}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Frequent</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {mostFrequentEmotion?.[0] || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-gray-900">{averageConfidence.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Emotion */}
      {currentEmotion && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Mood</h2>
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${getEmotionColor(currentEmotion.emotion)} bg-opacity-20`}>
              {getEmotionIcon(currentEmotion.emotion, 'h-8 w-8')}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 capitalize">{currentEmotion.emotion}</h3>
              <p className="text-gray-600">Confidence: {currentEmotion.confidence}%</p>
              <p className="text-sm text-gray-500">{format(currentEmotion.timestamp)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>

        {recentEmotions.length === 0 ? (
          <div className="text-center py-8">
            <Mic className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recordings yet. Start by recording your first emotion!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentEmotions.map((emotion) => (
              <div key={emotion.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${getEmotionColor(emotion.emotion)} bg-opacity-20`}>
                  {getEmotionIcon(emotion.emotion, 'h-5 w-5')}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 capitalize">{emotion.emotion}</p>
                  <p className="text-sm text-gray-500">{format(emotion.timestamp)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{emotion.confidence}%</p>
                  <p className="text-xs text-gray-500">confidence</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;