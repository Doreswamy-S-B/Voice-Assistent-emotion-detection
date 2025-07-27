import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { EmotionProvider } from './contexts/EmotionContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import VoiceRecorder from './components/VoiceRecorder';
import EmotionHistory from './components/EmotionHistory';
import SuggestionPanel from './components/SuggestionPanel';
import Navigation from './components/Navigation';
import { useAuth } from './contexts/AuthContext';
import { useEmotion } from './contexts/EmotionContext';

function AppContent() {
  const { user, loading } = useAuth();
  const { currentEmotion } = useEmotion();
  const [activeView, setActiveView] = useState<'dashboard' | 'record' | 'history' | 'suggestions'>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'record':
        return <VoiceRecorder />;
      case 'history':
        return <EmotionHistory />;
      case 'suggestions':
        return <SuggestionPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {renderActiveView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <EmotionProvider>
        <AppContent />
      </EmotionProvider>
    </AuthProvider>
  );
}

export default App;