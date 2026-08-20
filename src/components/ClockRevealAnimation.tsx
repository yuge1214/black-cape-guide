"use client";

import { useEffect, useRef, useState } from "react";
import SakuraScene from "./SakuraScene";

interface ClockRevealAnimationProps {
  onComplete: () => void;
}

type Phase = "black" | "clock" | "fadeout" | "reflection" | "pullup" | "done";

interface RippleRing {
  radius: number;
  maxRadius: number;
  alpha: number;
  width: number;
}

export default function ClockRevealAnimation({ onComplete }: ClockRevealAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("black");
  const ripplesRef = useRef<RippleRing[]>([]);
  const clockAlphaRef = useRef<number>(0);
  const [showReflection, setShowReflection] = useState(false);
  const [cameraY, setCameraY] = useState(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 2;
    const clockRadius = Math.min(w, h) * 0.48;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const easeOutQuad = (t: number): number => t * (2 - t);

    const woodDark = "#2a1a0a";
    const woodMid = "#4a2e12";
    const woodLight = "#6b4423";
    const woodBorder = "#8b5e3c";
    const woodHighlight = "#a67c52";
    const tickColor = "rgba(180, 160, 130, 0.6)";
    const tickHourColor = "rgba(220, 200, 170, 0.85)";
    const handColor = "rgba(200, 185, 160, 0.9)";
    const handGlow = "rgba(160, 140, 110, 0.3)";

    const drawClockFace = (ctx: CanvasRenderingContext2D, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha * 0.5;

      ctx.shadowColor = "rgba(139, 94, 60, 0.4)";
      ctx.shadowBlur = 40;

      const faceGrad = ctx.createRadialGradient(cx, cy, clockRadius * 0.2, cx, cy, clockRadius);
      faceGrad.addColorStop(0, woodDark);
      faceGrad.addColorStop(0.6, woodMid);
      faceGrad.addColorStop(0.9, woodLight);
      faceGrad.addColorStop(1, woodBorder);
      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, clockRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = woodBorder;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.strokeStyle = woodHighlight;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, clockRadius * 0.96, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const isHour = i % 3 === 0;
        const innerR = isHour ? clockRadius * 0.82 : clockRadius * 0.88;
        const outerR = clockRadius * 0.95;
        const tickWidth = isHour ? 3 : 1.5;

        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * outerR;
        const y2 = cy + Math.sin(angle) * outerR;

        ctx.strokeStyle = isHour ? tickHourColor : tickColor;
        ctx.lineWidth = tickWidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (isHour) {
          const numR = clockRadius * 0.72;
          const nx = cx + Math.cos(angle) * numR;
          const ny = cy + Math.sin(angle) * numR;
          ctx.fillStyle = tickHourColor;
          ctx.font = `bold ${clockRadius * 0.1}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const num = i === 0 ? 12 : i;
          ctx.fillText(num.toString(), nx, ny);
        }
      }

      ctx.restore();
    };

    const drawHand = (
      ctx: CanvasRenderingContext2D,
      angle: number,
      length: number,
      width: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha * 0.5;
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.shadowColor = handGlow;
      ctx.shadowBlur = 10;

      ctx.strokeStyle = handColor;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, clockRadius * 0.08);
      ctx.lineTo(0, -length);
      ctx.stroke();

      ctx.strokeStyle = "rgba(220, 200, 170, 0.5)";
      ctx.lineWidth = width * 0.4;
      ctx.beginPath();
      ctx.moveTo(0, clockRadius * 0.08);
      ctx.lineTo(0, -length * 0.7);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawCenterCap = (ctx: CanvasRenderingContext2D, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha * 0.5;
      const capGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, clockRadius * 0.05);
      capGrad.addColorStop(0, "#d4c4a8");
      capGrad.addColorStop(0.5, "#a08060");
      capGrad.addColorStop(1, "rgba(100, 80, 60, 0.5)");
      ctx.fillStyle = capGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, clockRadius * 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawRipples = (ctx: CanvasRenderingContext2D) => {
      ripplesRef.current.forEach((ring) => {
        const progress = ring.radius / ring.maxRadius;
        const alpha = ring.alpha * (1 - progress);

        ctx.save();
        const ringGrad = ctx.createRadialGradient(
          cx, cy, Math.max(0, ring.radius - ring.width),
          cx, cy, ring.radius + ring.width
        );
        ringGrad.addColorStop(0, "rgba(139, 94, 60, 0)");
        ringGrad.addColorStop(0.3, `rgba(139, 94, 60, ${alpha * 0.3})`);
        ringGrad.addColorStop(0.5, `rgba(180, 140, 100, ${alpha * 0.6})`);
        ringGrad.addColorStop(0.7, `rgba(139, 94, 60, ${alpha * 0.3})`);
        ringGrad.addColorStop(1, "rgba(139, 94, 60, 0)");
        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.radius + ring.width, 0, Math.PI * 2);
        ctx.arc(cx, cy, Math.max(0, ring.radius - ring.width), 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      });
    };

    const startMinuteAngle = Math.random() * Math.PI * 2;
    const startHourAngle = Math.random() * Math.PI * 2;
    const targetHourAngle = -Math.PI / 2;
    const targetMinuteAngle = -Math.PI / 2;

    const getHandAngles = (elapsedInClock: number) => {
      const minuteDuration = 4.0;
      const minuteProgress = Math.min(1, Math.max(0, elapsedInClock / minuteDuration));
      const minuteEased = easeOutQuad(minuteProgress);

      const hourProgress = elapsedInClock < minuteDuration ? minuteEased : 1;

      const minuteAngle = startMinuteAngle + (targetMinuteAngle - startMinuteAngle) * minuteEased;
      const hourAngle = startHourAngle + (targetHourAngle - startHourAngle) * hourProgress;

      return { minuteAngle, hourAngle, minuteProgress };
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      ctx.clearRect(0, 0, w, h);

      if (elapsed < 0.5) {
        phaseRef.current = "black";
      } else if (elapsed < 4.5) {
        phaseRef.current = "clock";
      } else if (elapsed < 5.5) {
        phaseRef.current = "fadeout";
      } else if (elapsed < 6.5) {
        phaseRef.current = "reflection";
      } else if (elapsed < 8.0) {
        phaseRef.current = "pullup";
      } else {
        phaseRef.current = "done";
      }

      if (phaseRef.current === "black") {
        const t = elapsed / 0.5;
        ctx.fillStyle = `rgba(0, 0, 0, ${t})`;
        ctx.fillRect(0, 0, w, h);
      }

      if (phaseRef.current === "clock") {
        const t = elapsed - 0.5;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        clockAlphaRef.current = Math.min(1, t / 0.8);
        const clockAlpha = clockAlphaRef.current;

        const { minuteAngle, hourAngle } = getHandAngles(t);

        const floatY = Math.sin(t * 0.6) * 5;
        const floatRotate = Math.sin(t * 0.3) * 0.02;

        ctx.save();
        ctx.translate(cx, cy + floatY);
        ctx.rotate(floatRotate);
        ctx.translate(-cx, -cy);

        drawClockFace(ctx, clockAlpha);
        drawHand(ctx, hourAngle, clockRadius * 0.5, 6, clockAlpha);
        drawHand(ctx, minuteAngle, clockRadius * 0.72, 4, clockAlpha);
        drawCenterCap(ctx, clockAlpha);

        ctx.restore();
      }

      if (phaseRef.current === "fadeout") {
        const t = elapsed - 4.5;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        const fadeAlpha = Math.max(0, 1 - t);

        if (fadeAlpha > 0.01) {
          const floatY = Math.sin(elapsed * 0.6) * 5 * (1 - t);
          ctx.save();
          ctx.translate(cx, cy + floatY);
          ctx.translate(-cx, -cy);

          drawClockFace(ctx, fadeAlpha);
          drawHand(ctx, targetHourAngle, clockRadius * 0.5, 6, fadeAlpha);
          drawHand(ctx, targetMinuteAngle, clockRadius * 0.72, 4, fadeAlpha);
          drawCenterCap(ctx, fadeAlpha);

          ctx.restore();
        }

        if (ripplesRef.current.length === 0 && t < 0.1) {
          for (let i = 0; i < 6; i++) {
            ripplesRef.current.push({
              radius: clockRadius * 0.3 + i * 20,
              maxRadius: Math.max(w, h) * 0.8,
              alpha: 0.6 - i * 0.08,
              width: 4 + i * 2,
            });
          }
        }

        ripplesRef.current.forEach((ring) => {
          ring.radius += (ring.maxRadius - ring.radius) * 0.05;
          if (ring.radius > ring.maxRadius * 0.95) {
            ring.alpha *= 0.9;
          }
        });

        ripplesRef.current = ripplesRef.current.filter((r) => r.alpha > 0.01);

        if (t > 0.1 && t < 0.8 && ripplesRef.current.length < 10) {
          const lastRing = ripplesRef.current[ripplesRef.current.length - 1];
          if (!lastRing || lastRing.radius > clockRadius * 0.5) {
            ripplesRef.current.push({
              radius: clockRadius * 0.2,
              maxRadius: Math.max(w, h) * 0.8,
              alpha: 0.4 + Math.random() * 0.2,
              width: 3 + Math.random() * 3,
            });
          }
        }

        drawRipples(ctx);

        const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
        centerGlow.addColorStop(0, `rgba(139, 94, 60, ${Math.min(0.2, t * 0.3)})`);
        centerGlow.addColorStop(0.5, `rgba(100, 70, 40, ${Math.min(0.1, t * 0.15)})`);
        centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, w, h);
      }

      if (phaseRef.current === "reflection") {
        const t = elapsed - 5.5;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        ripplesRef.current = ripplesRef.current.filter((r) => {
          r.radius += (r.maxRadius - r.radius) * 0.03;
          r.alpha *= 0.94;
          return r.alpha > 0.005;
        });
        drawRipples(ctx);

        if (t > 0.2 && !showReflection) {
          setShowReflection(true);
        }

        const waterAlpha = Math.min(0.3, t * 0.4);
        const waterGlow = ctx.createLinearGradient(0, cy - 30, 0, cy + 50);
        waterGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
        waterGlow.addColorStop(0.4, `rgba(100, 80, 60, ${waterAlpha * 0.5})`);
        waterGlow.addColorStop(0.5, `rgba(139, 94, 60, ${waterAlpha})`);
        waterGlow.addColorStop(0.6, `rgba(100, 80, 60, ${waterAlpha * 0.5})`);
        waterGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = waterGlow;
        ctx.fillRect(0, cy - 30, w, 80);
      }

      if (phaseRef.current === "pullup") {
        const t = elapsed - 6.5;
        const pullProgress = Math.min(1, t / 1.5);
        const easedProgress = easeOutQuad(pullProgress);

        const currentCameraY = 100 * (1 - easedProgress);
        setCameraY(currentCameraY);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        const waterAlpha = Math.max(0, 0.3 * (1 - pullProgress));
        if (waterAlpha > 0.01) {
          const waterGlow = ctx.createLinearGradient(0, cy - 30, 0, cy + 50);
          waterGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
          waterGlow.addColorStop(0.4, `rgba(100, 80, 60, ${waterAlpha * 0.5})`);
          waterGlow.addColorStop(0.5, `rgba(139, 94, 60, ${waterAlpha})`);
          waterGlow.addColorStop(0.6, `rgba(100, 80, 60, ${waterAlpha * 0.5})`);
          waterGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = waterGlow;
          ctx.fillRect(0, cy - 30, w, 80);
        }
      }

      if (phaseRef.current === "done") {
        setCameraY(0);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);
        setTimeout(() => {
          window.removeEventListener("resize", resize);
          onComplete();
        }, 100);
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: "#000" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />

      {showReflection && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${cameraY}vh)`,
            transition: phaseRef.current === "pullup" ? "none" : "transform 0.1s linear",
          }}
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              transform: "scaleY(-1)",
              filter: "blur(2px) brightness(0.6) saturate(0.8)",
              opacity: 0.7,
            }}
          >
            <SakuraScene />
          </div>
        </div>
      )}
    </div>
  );
}