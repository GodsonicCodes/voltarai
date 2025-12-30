"use client";

import { useEffect, useRef } from "react";

export default function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const phaseRef = useRef<"left" | "right">("left");
  const alphaValues = useRef<number[]>(new Array(32).fill(0));

  const baseHeights = [
    34, 48, 64, 54, 34, 42, 52, 40,
    74, 64, 54, 42, 24, 34, 38, 44,
    38, 44, 38, 26, 32, 44, 54, 42,
    66, 76, 62, 76, 56, 40, 26, 32
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // We set the internal drawing resolution to match the CSS size
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let timer = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const barCount = 32;
      
      // ORIGINAL SIZES PRESERVED
      const gap = Math.max(4, rect.width / 200);
      const barWidth = Math.max(3, rect.width / 130);

      timer += 1;
      if (timer > 90) {
        phaseRef.current = phaseRef.current === "left" ? "right" : "left";
        timer = 0;
      }

      for (let i = 0; i < barCount; i++) {
        const isLeftHalf = i < barCount / 2;
        const target = phaseRef.current === "left" ? (isLeftHalf ? 1 : 0.15) : (!isLeftHalf ? 1 : 0.15);

        // Smoother easing
        alphaValues.current[i] += (target - alphaValues.current[i]) * 0.05;

        const h = (baseHeights[i] / 80) * rect.height;
        const x = i * (barWidth + gap);
        const y = (rect.height - h) / 2;

        ctx.fillStyle = `rgba(255,255,255,${alphaValues.current[i]})`;
        const radius = Math.min(4, barWidth / 2);

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + h - radius);
        ctx.quadraticCurveTo(x + barWidth, y + h, x + barWidth - radius, y + h);
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
      observer.disconnect();
    };
  }, []);

  return (
    /* The container is now set to a width that exactly fits 32 bars 
       based on your original calculation logic (roughly 395px).
    */
    <div className="mx-auto w-fit">
      <canvas
        ref={canvasRef}
        style={{
          // This ensures the canvas width is exactly the sum of bars + gaps
          width: 'calc(32 * (max(3px, 420px / 130) + max(4px, 420px / 200)) - max(4px, 420px / 200))'
        }}
        className="max-w-[100vw] h-[48px] md:h-[76px] block"
      />
    </div>
  );
}