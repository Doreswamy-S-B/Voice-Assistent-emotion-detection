import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  isRecording: boolean;
  stream: MediaStream | null;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isRecording, stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (isRecording && stream && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const draw = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8;

          const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
          gradient.addColorStop(1, 'rgba(147, 51, 234, 0.8)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }

        animationRef.current = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        audioContext.close();
      };
    } else {
      // Draw static waveform when not recording
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'rgba(156, 163, 175, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw static bars
          const barCount = 50;
          const barWidth = canvas.width / barCount;
          
          for (let i = 0; i < barCount; i++) {
            const barHeight = Math.random() * canvas.height * 0.3;
            ctx.fillStyle = 'rgba(156, 163, 175, 0.3)';
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
          }
        }
      }
    }
  }, [isRecording, stream]);

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
      <canvas
        ref={canvasRef}
        width={400}
        height={120}
        className="w-full h-24 rounded-lg"
      />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {isRecording ? 'Recording audio...' : 'Audio waveform will appear here'}
        </p>
      </div>
    </div>
  );
};

export default WaveformVisualizer;