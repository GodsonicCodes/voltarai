"use client";

import { useEffect, useRef, useState, useMemo } from "react";

export default function Waveform({ listening = false }: { listening?: boolean }) {
  interface ExtendedHTMLCanvasElement extends HTMLCanvasElement {
    stream?: MediaStream;
  }
  
  const canvasRef = useRef<ExtendedHTMLCanvasElement>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const currentHeights = useRef<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // your base heights (pixels)
  const baseHeightsPx = useMemo(() => [
    34, 48, 64, 54, 34, 42, 52, 40,
    74, 64, 54, 42, 24, 34, 38, 44,
    38, 44, 38, 26, 32, 44, 54, 42,
    66, 76, 62, 76, 56, 40, 26, 32
  ], []);

  useEffect(() => {
    currentHeights.current = [...baseHeightsPx];
  }, [baseHeightsPx]);

  // Don't initialize the audio context here since it's handled by the volume listener
  // We'll use a different approach to visualize the waveform when listening
  useEffect(() => {
    if (listening) {
      // Initialize audio context when listening starts
      const initAudio = async () => {
        try {
          type WindowWithAudioContext = Window & {
            webkitAudioContext?: typeof AudioContext;
          };
          const AudioContextClass = window.AudioContext || 
            (window as WindowWithAudioContext).webkitAudioContext;
          if (!AudioContextClass) {
            throw new Error('AudioContext is not supported');
          }
          const audioCtx = new AudioContextClass();
          
          audioContextRef.current = audioCtx;
          
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: false,
            }
          });

          const source = audioCtx.createMediaStreamSource(stream);
          const analyserNode = audioCtx.createAnalyser();
          analyserNode.fftSize = 256; // Smaller for more responsive
          analyserNode.smoothingTimeConstant = 0.8; // Reduced for less smoothing

          source.connect(analyserNode);
          setAnalyser(analyserNode);
          
          // Store the stream for cleanup
          if (canvasRef.current) {
            (canvasRef.current!).stream = stream;
          }
        } catch (error) {
          console.error('Error setting up audio:', error);
        }
      };
      
      initAudio();
    }
    
    // Cleanup function
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      // Stop any active tracks - capture ref value to avoid stale closure
      const canvas = canvasRef.current;
      if (canvas) {
        const extendedCanvas = canvas as ExtendedHTMLCanvasElement;
        if (extendedCanvas.stream) {
          const stream = extendedCanvas.stream;
          stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }
      }
    };
  }, [listening]);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d")!;
    const freq = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(freq);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only draw if listening (user is speaking)
      if (!listening) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // global average for color brightness - focus on speech frequencies (80-2000Hz)
      let speechLevel = 0;
      const audioCtx = audioContextRef.current;
      
      if (audioCtx) {
        const speechStartIndex = Math.floor(80 / (audioCtx.sampleRate / 2) * freq.length);
        const speechEndIndex = Math.floor(2000 / (audioCtx.sampleRate / 2) * freq.length);
        
        for (let i = speechStartIndex; i < Math.min(speechEndIndex, freq.length); i++) {
          speechLevel += freq[i];
        }
        speechLevel /= (speechEndIndex - speechStartIndex);
      }

      // more responsive opacity when listening - less sensitive
      const alpha = Math.min(0.3 + speechLevel / 150, 0.9);

      const barCount = 32;
      const gap = 8;
      const barWidth = 5;

      for (let i = 0; i < barCount; i++) {
        // map frequencies to our 32 bars - focus on lower frequencies for speech
        const bucketIndex = Math.floor((i / barCount) * freq.length * 0.5); // use lower half of spectrum

        const energy = freq[bucketIndex] / 255; // 0–1
        
        // speech detection threshold - less sensitive
        const speechThreshold = 0.05;
        const isSpeechDetected = energy > speechThreshold;

        // target height above base - reduced boost for smoother response
        const target =
          baseHeightsPx[i] +
          (isSpeechDetected ? energy * 40 : energy * 10); // smaller boost

        // smoother easing for both rise and fall
        const current = currentHeights.current[i] ?? baseHeightsPx[i];
        const lerpSpeed = target > current ? 0.15 : 0.08;
        const next = current + (target - current) * lerpSpeed;

        currentHeights.current[i] = next;

        const h = next;
        const x = i * (barWidth + gap);
        const y = (canvas.height - h) / 2;

        // set dynamic white shade with speech emphasis
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;

        const radius = 3;

        // draw rounded bar
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + h - radius);
        ctx.quadraticCurveTo(
          x + barWidth,
          y + h,
          x + barWidth - radius,
          y + h
        );
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, listening, baseHeightsPx]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[255px] h-[48px] md:w-[416px] md:h-[76px]"
      width={416}
      height={76}
    />
  );
}
