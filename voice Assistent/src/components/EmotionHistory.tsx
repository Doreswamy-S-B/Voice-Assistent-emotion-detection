import React, { useState } from 'react';
import { Calendar, Trash2, TrendingUp, Filter, Download } from 'lucide-react';
import { useEmotion } from '../contexts/EmotionContext';
import { getEmotionColor, getEmotionIcon } from '../utils/emotionUtils';
import { format, formatDate } from '../utils/dateUtils';

const EmotionHistory: React.FC = () => {
  const { emotionHistory, clearHistory } = useEmotion();
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'emotion' | 'confidence'>('date');

  // Filter emotions based on selected filter
  const filteredEmotions = emotionHistory.filter(emotion => {
    if (filter === 'all') return true;
    return emotion.emotion === filter;
  });

  // Sort emotions
  const sortedEmotions = [...filteredEmotions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'emotion':
        return a.emotion.localeCompare(b.emotion);
      case 'confidence':
        return b.confidence - a.confidence;
      default:
        return 0;
    }
  });

  // Get unique emotions for filter
  const uniqueEmotions = [...new Set(emotionHistory.map(e => e.emotion))];

  // Calculate emotion statistics
  const emotionStats = emotionHistory.reduce((acc, emotion) => {
    acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportData = () => {
    const data = emotionHistory.map(emotion => ({
      emotion: emotion.emotion,
      confidence: emotion.confidence,
      timestamp: emotion.timestamp
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotion_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emotion History</h1>
          <p className="text-gray-600 mt-1">Track your emotional journey over time</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={exportData}
            disabled={emotionHistory.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={clearHistory}
            disabled={emotionHistory.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      {emotionHistory.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Emotion Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(emotionStats)
              .sort(([,a], [,b]) => b - a)
              .map(([emotion, count]) => (
                <div key={emotion} className="text-center">
                  <div className={`p-3 rounded-lg ${getEmotionColor(emotion)} bg-opacity-20 mx-auto w-fit`}>
                    {getEmotionIcon(emotion, 'h-6 w-6')}
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2 capitalize">{emotion}</p>
                  <p className="text-lg font-bold text-gray-700">{count}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Emotions</option>
                {uniqueEmotions.map(emotion => (
                  <option key={emotion} value={emotion} className="capitalize">
                    {emotion}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Date</option>
                <option value="emotion">Emotion</option>
                <option value="confidence">Confidence</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Showing {sortedEmotions.length} of {emotionHistory.length} recordings
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        {sortedEmotions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {filter === 'all' ? 'No recordings yet' : `No ${filter} emotions recorded`}
            </p>
            <p className="text-gray-400 mt-2">
              Start recording to build your emotion history
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedEmotions.map((emotion) => (
              <div key={emotion.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getEmotionColor(emotion.emotion)} bg-opacity-20`}>
                      {getEmotionIcon(emotion.emotion, 'h-6 w-6')}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {emotion.emotion}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {format(emotion.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {emotion.confidence}%
                        </p>
                        <p className="text-xs text-gray-500">confidence</p>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full bg-gray-100 relative overflow-hidden">
                        <div 
                          className={`absolute bottom-0 left-0 right-0 ${getEmotionColor(emotion.emotion)} bg-opacity-50 transition-all`}
                          style={{ height: `${emotion.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionHistory;