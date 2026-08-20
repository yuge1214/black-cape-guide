"use client";

import { useEffect, useRef } from "react";

interface OpeningAnimationProps {
  onComplete: () => void;
}

interface Crack {
  cx: number;
  cy: number;
  angle: number;
  length: number;
  alpha: number;
  segments: { angle: number; length: number; offset: number }[];
  subCracks: { angle: number; length: number; offset: number }[];
}

interface Fragment {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  alpha: number;
  color: string;
}

interface StreamParticle {
  angle: number;
  dist: number;
  speed: number;
  size: number;
  alpha: number;
  color: string;
  trail: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  life: number;
  maxLife: number;
}

type AnimPhase = "black" | "firstSlash" | "multiCracks" | "crackedPause" | "shatter" | "tunnel" | "fadeout";

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const phaseRef = useRef<AnimPhase>("black");
  const cracksRef = useRef<Crack[]>([]);
  const fragmentsRef = useRef<Fragment[]>([]);
  const streamParticlesRef = useRef<StreamParticle[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const tunnelRadiusRef = useRef<number>(0);
  const fadeAlphaRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);
  const firstSlashDoneRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const cx = w / 2;
    const cy = h / 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const initFragments = () => {
      const frags: Fragment[] = [];
      const gridCols = 24;
      const gridRows = 16;
      const fw = w / gridCols;
      const fh = h / gridRows;
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const fx = col * fw;
          const fy = row * fh;
          const fcx = fx + fw / 2;
          const fcy = fy + fh / 2;
          const dx = fcx - cx;
          const dy = fcy - cy;
          const angle = Math.atan2(dy, dx);
          const force = 200 + Math.random() * 600;
          frags.push({
            x: fx,
            y: fy,
            w: fw + 2,
            h: fh + 2,
            vx: Math.cos(angle) * force,
            vy: Math.sin(angle) * force,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 12,
            alpha: 1,
            color: `hsl(${260 + Math.random() * 40}, ${30 + Math.random() * 20}%, ${5 + Math.random() * 14}%)`,
          });
        }
      }
      return frags;
    };

    const initStreamParticles = () => {
      const particles: StreamParticle[] = [];
      for (let i = 0; i < 400; i++) {
        particles.push({
          angle: Math.random() * Math.PI * 2,
          dist: Math.random() * Math.max(w, h) * 0.8,
          speed: 60 + Math.random() * 300,
          size: Math.random() * 2.5 + 0.5,
          alpha: Math.random() * 0.9 + 0.1,
          color: Math.random() > 0.6 ? "#c4b5fd" : Math.random() > 0.5 ? "#a78bfa" : Math.random() > 0.5 ? "#ddd6fe" : "#7c3aed",
          trail: 3 + Math.random() * 8,
        });
      }
      return particles;
    };

    fragmentsRef.current = initFragments();
    streamParticlesRef.current = initStreamParticles();

    // 绘制剑刃（仅剑刃和部分剑身，无护手剑柄）
    const drawBlade = (
      ctx: CanvasRenderingContext2D,
      sx: number, sy: number,
      ex: number, ey: number,
      alpha: number
    ) => {
      const dx = ex - sx;
      const dy = ey - sy;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1) return;

      ctx.save();
      ctx.globalAlpha = alpha;

      // 外层光晕
      const outerGlow = ctx.createLinearGradient(sx, sy, ex, ey);
      outerGlow.addColorStop(0, "rgba(180, 200, 255, 0)");
      outerGlow.addColorStop(0.25, "rgba(160, 190, 240, 0.35)");
      outerGlow.addColorStop(0.5, "rgba(220, 240, 255, 0.55)");
      outerGlow.addColorStop(0.75, "rgba(160, 190, 240, 0.35)");
      outerGlow.addColorStop(1, "rgba(180, 200, 255, 0)");
      ctx.strokeStyle = outerGlow;
      ctx.lineWidth = 40;
      ctx.lineCap = "round";
      ctx.shadowColor = "#aaccff";
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // 中层光晕
      ctx.strokeStyle = "rgba(200, 230, 255, 0.65)";
      ctx.lineWidth = 14;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // 剑刃核心
      ctx.strokeStyle = "rgba(240, 248, 255, 0.95)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // 最亮白线
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();
    };

    // 生成主分支裂纹
    const generateSegments = (baseAngle: number, length: number, count: number) => {
      const segs: { angle: number; length: number; offset: number }[] = [];
      for (let i = 0; i < count; i++) {
        const offset = length * (0.15 + Math.random() * 0.75);
        const segAngle = baseAngle + (Math.random() - 0.5) * 1.4;
        const segLen = length * (0.12 + Math.random() * 0.4);
        segs.push({ angle: segAngle, length: segLen, offset });
      }
      return segs;
    };

    // 生成子裂纹（更细小的分支）
    const generateSubCracks = (baseAngle: number, length: number, count: number) => {
      const subs: { angle: number; length: number; offset: number }[] = [];
      for (let i = 0; i < count; i++) {
        const offset = length * (0.1 + Math.random() * 0.8);
        const subAngle = baseAngle + (Math.random() - 0.5) * 1.8;
        const subLen = length * (0.05 + Math.random() * 0.2);
        subs.push({ angle: subAngle, length: subLen, offset });
      }
      return subs;
    };

    // 绘制裂纹（层次更丰富）
    const drawCrack = (ctx: CanvasRenderingContext2D, crack: Crack) => {
      ctx.save();
      ctx.translate(crack.cx, crack.cy);
      const a = crack.alpha;
      const endX = Math.cos(crack.angle) * crack.length;
      const endY = Math.sin(crack.angle) * crack.length;

      // 外层光晕
      ctx.strokeStyle = `rgba(180, 160, 240, ${a * 0.45})`;
      ctx.lineWidth = 10;
      ctx.shadowColor = "#c4b5fd";
      ctx.shadowBlur = 22 * a;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // 紫色光晕
      ctx.strokeStyle = `rgba(200, 180, 250, ${a * 0.65})`;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 12 * a;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // 核心白线
      ctx.strokeStyle = `rgba(230, 220, 255, ${a * 0.9})`;
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 6 * a;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // 主分支裂纹
      crack.segments.forEach(seg => {
        const bx = Math.cos(crack.angle) * seg.offset;
        const by = Math.sin(crack.angle) * seg.offset;
        const bex = bx + Math.cos(seg.angle) * seg.length;
        const bey = by + Math.sin(seg.angle) * seg.length;

        ctx.strokeStyle = `rgba(180, 160, 240, ${a * 0.35})`;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 8 * a;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bex, bey);
        ctx.stroke();

        ctx.strokeStyle = `rgba(220, 200, 255, ${a * 0.55})`;
        ctx.lineWidth = 0.7;
        ctx.shadowBlur = 3 * a;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bex, bey);
        ctx.stroke();
      });

      // 子裂纹（更细小的分支）
      crack.subCracks.forEach(sub => {
        const bx = Math.cos(crack.angle) * sub.offset;
        const by = Math.sin(crack.angle) * sub.offset;
        const bex = bx + Math.cos(sub.angle) * sub.length;
        const bey = by + Math.sin(sub.angle) * sub.length;

        ctx.strokeStyle = `rgba(200, 180, 250, ${a * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.shadowBlur = 3 * a;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bex, bey);
        ctx.stroke();
      });

      ctx.shadowBlur = 0;
      ctx.restore();
    };

    // 绘制火花
    const drawSparks = (ctx: CanvasRenderingContext2D) => {
      sparksRef.current.forEach(sp => {
        ctx.save();
        const grad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.size * 2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${sp.alpha})`);
        grad.addColorStop(0.3, `rgba(200, 180, 255, ${sp.alpha * 0.8})`);
        grad.addColorStop(0.7, `rgba(140, 100, 220, ${sp.alpha * 0.3})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      ctx.clearRect(0, 0, w, h);

      if (elapsed < 1.0) {
        phaseRef.current = "black";
      } else if (elapsed < 1.8) {
        phaseRef.current = "firstSlash";
      } else if (elapsed < 5.0) {
        phaseRef.current = "multiCracks";
      } else if (elapsed < 5.5) {
        phaseRef.current = "crackedPause";
      } else if (elapsed < 6.0) {
        phaseRef.current = "shatter";
      } else if (elapsed < 8.0) {
        phaseRef.current = "tunnel";
      } else {
        phaseRef.current = "fadeout";
      }

      // === 黑色阶段 ===
      if (phaseRef.current === "black") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);
      }

      // === 第一斩：剑刃从中心偏左向左刺开，然后向右划出裂痕 ===
      if (phaseRef.current === "firstSlash") {
        const t = elapsed - 1.0;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        const slashOriginX = cx - 80;
        const slashOriginY = cy;

        if (t < 0.35) {
          // 刺入阶段：剑刃向左刺
          const pierceProgress = Math.min(t / 0.35, 1);
          const pierceLen = w * 0.5;
          const startX = slashOriginX;
          const startY = slashOriginY;
          const endX = startX - pierceProgress * pierceLen;
          const endY = startY;

          drawBlade(ctx, startX, startY, endX, endY, 1);

          if (pierceProgress > 0.3) {
            for (let i = 0; i < 3; i++) {
              sparksRef.current.push({
                x: endX + (Math.random() - 0.5) * 15,
                y: endY + (Math.random() - 0.5) * 15,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                alpha: 1,
                size: Math.random() * 2 + 1,
                life: 0,
                maxLife: 0.4 + Math.random() * 0.4,
              });
            }
          }
        } else if (t < 0.8) {
          // 划过阶段：向右划，留下裂痕
          const slashProgress = Math.min((t - 0.35) / 0.45, 1);
          const slashLen = w * 0.7;
          const startX = slashOriginX - w * 0.5;
          const startY = slashOriginY;
          const endX = startX + slashProgress * slashLen;
          const endY = slashOriginY + Math.sin(slashProgress * Math.PI) * 15;

          drawBlade(ctx, startX, startY, endX, endY, 1);

          if (!firstSlashDoneRef.current && slashProgress > 0.15) {
            firstSlashDoneRef.current = true;
            cracksRef.current.push({
              cx: slashOriginX,
              cy: slashOriginY,
              angle: 0,
              length: w * 0.7,
              alpha: 0,
              segments: generateSegments(0, w * 0.7, 6),
              subCracks: generateSubCracks(0, w * 0.7, 8),
            });
          }

          if (slashProgress > 0.1 && slashProgress < 0.9) {
            for (let i = 0; i < 4; i++) {
              sparksRef.current.push({
                x: endX + (Math.random() - 0.5) * 20,
                y: endY + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                alpha: 1,
                size: Math.random() * 2.5 + 1,
                life: 0,
                maxLife: 0.35 + Math.random() * 0.45,
              });
            }
          }
        }
      }

      // === 多段裂纹：由慢到快，无规律地布满屏幕 ===
      if (phaseRef.current === "multiCracks") {
        const t = elapsed - 1.8;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        const progress = t / 3.2;
        const baseInterval = 0.35 - progress * 0.3;
        const noise = Math.sin(t * 7.3) * 0.05 + Math.cos(t * 3.7) * 0.04;
        const spawnInterval = Math.max(0.04, baseInterval + noise);
        const currentTime = elapsed;

        const maxCracks = 35;
        if (currentTime - lastSpawnTimeRef.current >= spawnInterval && cracksRef.current.length < maxCracks) {
          lastSpawnTimeRef.current = currentTime;

          const rx = Math.random() * w;
          const ry = Math.random() * h;
          const mainAngle = Math.random() * Math.PI * 2;
          const mainLength = (60 + Math.random() * 350) * (1 + progress * 0.6);

          cracksRef.current.push({
            cx: rx,
            cy: ry,
            angle: mainAngle,
            length: mainLength,
            alpha: 0,
            segments: generateSegments(mainAngle, mainLength, 5 + Math.floor(progress * 8)),
            subCracks: generateSubCracks(mainAngle, mainLength, 6 + Math.floor(progress * 10)),
          });

          const sparkCount = 2 + Math.floor(progress * 6);
          for (let i = 0; i < sparkCount; i++) {
            sparksRef.current.push({
              x: rx + (Math.random() - 0.5) * 15,
              y: ry + (Math.random() - 0.5) * 15,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              alpha: 1,
              size: Math.random() * 2 + 1,
              life: 0,
              maxLife: 0.3 + Math.random() * 0.5,
            });
          }
        }

        cracksRef.current.forEach((crack, i) => {
          crack.alpha = Math.min(1, crack.alpha + 0.03);
          if (crack.alpha > 0.75) {
            crack.alpha = 0.7 + 0.3 * Math.sin(elapsed * 6 + i * 1.7);
          }
          if (crack.alpha > 0.08) {
            drawCrack(ctx, crack);
          }
        });

        const glowAlpha = progress * 0.1;
        const globalGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
        globalGlow.addColorStop(0, `rgba(140, 100, 220, ${glowAlpha})`);
        globalGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = globalGlow;
        ctx.fillRect(0, 0, w, h);
      }

      // === 裂纹暂停：展示0.5秒布满裂纹的屏幕 ===
      if (phaseRef.current === "crackedPause") {
        const t = elapsed - 5.0;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        cracksRef.current.forEach((crack, i) => {
          crack.alpha = 0.75 + 0.25 * Math.sin(elapsed * 5 + i * 1.3);
          drawCrack(ctx, crack);
        });

        const pauseGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
        pauseGlow.addColorStop(0, "rgba(140, 100, 220, 0.12)");
        pauseGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = pauseGlow;
        ctx.fillRect(0, 0, w, h);
      }

      // === 屏幕破碎：从中心向外 ===
      if (phaseRef.current === "shatter") {
        const t = elapsed - 5.5;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        cracksRef.current.forEach(crack => {
          crack.alpha = Math.max(0, crack.alpha - 0.04);
          if (crack.alpha > 0.05) drawCrack(ctx, crack);
        });

        if (t < 0.08) {
          ctx.fillStyle = `rgba(255, 255, 255, ${(1 - t / 0.08) * 0.7})`;
          ctx.fillRect(0, 0, w, h);
        }

        const frags = fragmentsRef.current;
        frags.forEach(frag => {
          frag.x += frag.vx * 0.018;
          frag.y += frag.vy * 0.018;
          frag.rotation += frag.rotSpeed * 0.018;
          frag.alpha = Math.max(0, frag.alpha - 0.018);

          ctx.save();
          ctx.translate(frag.x + frag.w / 2, frag.y + frag.h / 2);
          ctx.rotate(frag.rotation);
          ctx.fillStyle = frag.color;
          ctx.globalAlpha = frag.alpha;
          ctx.fillRect(-frag.w / 2, -frag.h / 2, frag.w, frag.h);
          ctx.strokeStyle = `rgba(160, 140, 220, ${frag.alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(-frag.w / 2, -frag.h / 2, frag.w, frag.h);
          ctx.restore();
        });
      }

      // === 时空通道 ===
      if (phaseRef.current === "tunnel") {
        const t = elapsed - 6.0;
        ctx.fillStyle = "#010005";
        ctx.fillRect(0, 0, w, h);

        const maxRadius = Math.max(w, h) * 0.9;
        const radius = Math.min(maxRadius, t * maxRadius * 0.5);
        tunnelRadiusRef.current = radius;

        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.3);
        coreGrad.addColorStop(0, "#000000");
        coreGrad.addColorStop(0.5, "#0a0018");
        coreGrad.addColorStop(0.8, "#150030");
        coreGrad.addColorStop(1, "rgba(30, 10, 60, 0)");
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        for (let layer = 0; layer < 4; layer++) {
          const layerT = Math.max(0, t - layer * 0.15);
          const layerRadius = layerT * maxRadius * 0.35;
          const ringWidth = 15 + layer * 5;
          if (layerRadius > 0 && layerRadius < radius * 1.5) {
            const innerR = Math.max(0, layerRadius - ringWidth);
            const ringGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, layerRadius + ringWidth);
            const ringAlpha = 0.15 + layer * 0.05;
            ringGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
            ringGrad.addColorStop(0.3, `rgba(140, 100, 220, ${ringAlpha * 0.5})`);
            ringGrad.addColorStop(0.5, `rgba(180, 140, 240, ${ringAlpha})`);
            ringGrad.addColorStop(0.7, `rgba(140, 100, 220, ${ringAlpha * 0.5})`);
            ringGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = ringGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, layerRadius + ringWidth, 0, Math.PI * 2);
            ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
            ctx.fill();
          }
        }

        const particles = streamParticlesRef.current;
        particles.forEach(p => {
          p.dist += p.speed * 0.018;
          if (p.dist > maxRadius * 1.2) {
            p.dist = 5 + Math.random() * 20;
            p.angle = Math.random() * Math.PI * 2;
            p.speed = 60 + Math.random() * 300;
          }
          const px = cx + Math.cos(p.angle) * p.dist;
          const py = cy + Math.sin(p.angle) * p.dist;
          const trailX = px + Math.cos(p.angle + Math.PI) * p.trail;
          const trailY = py + Math.sin(p.angle + Math.PI) * p.trail;

          ctx.save();
          const trailGrad = ctx.createLinearGradient(trailX, trailY, px, py);
          trailGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
          trailGrad.addColorStop(0.5, `rgba(160, 120, 240, ${p.alpha * 0.4})`);
          trailGrad.addColorStop(1, `rgba(200, 170, 255, ${p.alpha})`);
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";
          ctx.shadowColor = "#c4b5fd";
          ctx.shadowBlur = p.size * 3;
          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.restore();
        });

        const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.2);
        centerGlow.addColorStop(0, "rgba(200, 170, 255, 0.5)");
        centerGlow.addColorStop(0.5, "rgba(140, 100, 220, 0.2)");
        centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = centerGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // === 淡出 ===
      if (phaseRef.current === "fadeout") {
        const t = elapsed - 8.0;
        fadeAlphaRef.current = Math.min(1, t / 0.5);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        const radius = tunnelRadiusRef.current;
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.3);
        coreGrad.addColorStop(0, "#000000");
        coreGrad.addColorStop(0.5, "#0a0018");
        coreGrad.addColorStop(0.8, "#150030");
        coreGrad.addColorStop(1, "rgba(30, 10, 60, 0)");
        ctx.fillStyle = coreGrad;
        ctx.globalAlpha = 1 - fadeAlphaRef.current;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        const particles = streamParticlesRef.current;
        particles.forEach(p => {
          p.dist += p.speed * 0.018;
          if (p.dist > Math.max(w, h) * 1.2) {
            p.dist = 5 + Math.random() * 20;
            p.angle = Math.random() * Math.PI * 2;
          }
          const px = cx + Math.cos(p.angle) * p.dist;
          const py = cy + Math.sin(p.angle) * p.dist;
          const trailX = px + Math.cos(p.angle + Math.PI) * p.trail;
          const trailY = py + Math.sin(p.angle + Math.PI) * p.trail;

          ctx.save();
          const trailGrad = ctx.createLinearGradient(trailX, trailY, px, py);
          trailGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
          trailGrad.addColorStop(0.5, `rgba(160, 120, 240, ${p.alpha * 0.4 * (1 - fadeAlphaRef.current)})`);
          trailGrad.addColorStop(1, `rgba(200, 170, 255, ${p.alpha * (1 - fadeAlphaRef.current)})`);
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(trailX, trailY);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.restore();
        });

        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlphaRef.current})`;
        ctx.fillRect(0, 0, w, h);
      }

      sparksRef.current = sparksRef.current.filter(sp => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life += 0.018;
        sp.alpha = Math.max(0, 1 - sp.life / sp.maxLife);
        return sp.alpha > 0;
      });
      drawSparks(ctx);

      if (phaseRef.current === "fadeout" && fadeAlphaRef.current >= 1) {
        window.removeEventListener("resize", resize);
        onComplete();
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
    <div className="fixed inset-0 z-50" style={{ background: "#000000" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}