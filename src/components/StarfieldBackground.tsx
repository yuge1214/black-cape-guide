"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 初始化星星
    const starCount = 200;
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制深紫色渐变背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, "#1a0a2e");
      gradient.addColorStop(0.4, "#0f0518");
      gradient.addColorStop(1, "#050208");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制星云效果
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.4,
        0,
        canvas.width * 0.3,
        canvas.height * 0.4,
        canvas.width * 0.5
      );
      nebulaGradient.addColorStop(0, "rgba(138, 43, 226, 0.08)");
      nebulaGradient.addColorStop(0.5, "rgba(75, 0, 130, 0.04)");
      nebulaGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 第二个星云
      const nebulaGradient2 = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.6,
        0,
        canvas.width * 0.7,
        canvas.height * 0.6,
        canvas.width * 0.4
      );
      nebulaGradient2.addColorStop(0, "rgba(147, 51, 234, 0.06)");
      nebulaGradient2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebulaGradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制星星
      starsRef.current.forEach((star) => {
        // 更新星星位置（缓慢向上飘动）
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        // 闪烁效果
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;

        // 绘制星星光晕
        const glowGradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 3
        );
        glowGradient.addColorStop(0, `rgba(200, 180, 255, ${currentOpacity * 0.8})`);
        glowGradient.addColorStop(0.5, `rgba(150, 100, 255, ${currentOpacity * 0.3})`);
        glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // 绘制星星核心
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 偶尔绘制流星
      if (Math.random() < 0.005) {
        const meteorX = Math.random() * canvas.width;
        const meteorY = Math.random() * canvas.height * 0.5;
        const meteorLength = Math.random() * 80 + 40;
        const meteorAngle = Math.PI / 4;

        const meteorGradient = ctx.createLinearGradient(
          meteorX,
          meteorY,
          meteorX - Math.cos(meteorAngle) * meteorLength,
          meteorY - Math.sin(meteorAngle) * meteorLength
        );
        meteorGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        meteorGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = meteorGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(meteorX, meteorY);
        ctx.lineTo(
          meteorX - Math.cos(meteorAngle) * meteorLength,
          meteorY - Math.sin(meteorAngle) * meteorLength
        );
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}