import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Trash2 } from 'lucide-react';
import { useEmotion } from '../contexts/EmotionContext';
import { analyzeEmotion } from '../utils/emotionAnalysis';
import WaveformVisualizer from './WaveformVisualizer';

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { addEmotionResult } = useEmotion();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudio(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setPermissionDenied(false);

      intervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const playRecording = () => {
    if (recordedAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const analyzeRecording = async () => {
    if (!recordedAudio) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate emotion analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = analyzeEmotion();
      addEmotionResult(result);
      
      // Clear the recording
      setRecordedAudio(null);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteRecording = () => {
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio);
    }
    setRecordedAudio(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (permissionDenied) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
          <div className="p-4 bg-red-100 rounded-full inline-block mb-4">
            <MicOff className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Microphone Access Required</h2>
          <p className="text-gray-600 mb-6">
            We need access to your microphone to analyze your voice emotions. 
            Please allow microphone access and refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Voice Emotion Analysis</h1>
        <p className="text-lg text-gray-600">
          Record your voice to analyze your current emotional state
        </p>
      </div>

      {/* Recording Interface */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        {/* Waveform Visualizer */}
        <div className="mb-8">
          <WaveformVisualizer 
            isRecording={isRecording} 
            stream={streamRef.current}
          />
        </div>

        {/* Recording Controls */}
        <div className="text-center space-y-6">
          {!recordedAudio ? (
            <div className="space-y-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-red-500 border-red-600 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-700 hover:from-blue-700 hover:to-purple-700 text-white'
                }`}
              >
                {isRecording ? (
                  <Square className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </button>

              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isRecording ? 'Recording...' : 'Tap to record'}
                </p>
                {isRecording && (
                  <p className="text-sm text-gray-600 mt-2">
                    Duration: {formatTime(recordingTime)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={playRecording}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-gray-700" />
                  ) : (
                    <Play className="h-6 w-6 text-gray-700" />
                  )}
                </button>
                
                <div className="text-center">
                  <p className="font-medium text-gray-900">Recording ready</p>
                  <p className="text-sm text-gray-600">Duration: {formatTime(recordingTime)}</p>
                </div>

                <button
                  onClick={deleteRecording}
                  className="p-3 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                >
                  <Trash2 className="h-6 w-6 text-red-600" />
                </button>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeRecording}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Analyze Emotion'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Hidden audio element for playback */}
        {recordedAudio && (
          <audio
            ref={audioRef}
            src={recordedAudio}
            onEnded={() => setIsPlaying(false)}
            style={{ display: 'none' }}
          />
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-3">Tips for Better Analysis</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Speak naturally for 5-10 seconds</li>
          <li>• Find a quiet environment to reduce background noise</li>
          <li>• Express your current feelings authentically</li>
          <li>• Try different phrases or topics to see varying results</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecorder;