"use client";

import { useEffect, useRef } from "react";

// ============================================
// 可调参数配置
// ============================================
const CONFIG = {
  petals: {
    count: 60,
    minSize: 2,
    maxSize: 5,
    colors: [
      { r: 255, g: 200, b: 220, a: 0.9 },
      { r: 255, g: 180, b: 210, a: 0.85 },
      { r: 255, g: 160, b: 200, a: 0.8 },
      { r: 255, g: 220, b: 235, a: 0.75 },
      { r: 255, g: 240, b: 250, a: 0.7 },
      { r: 255, g: 190, b: 215, a: 0.82 },
      { r: 255, g: 170, b: 205, a: 0.78 },
    ]
  },

  tree: {
    maxDepth: 8,
    branchAngle: 0.7,
    lengthDecay: 0.72,
    widthDecay: 0.68,
    trunkLength: 180,
    trunkWidth: 32,
  },

  ground: {
    grassCount: 60,
    grassHeight: 25,
  }
};

// ============================================
// 屏幕适配
// ============================================
function getResponsiveScale(canvasWidth: number, canvasHeight: number): number {
  const minDim = Math.min(canvasWidth, canvasHeight);
  const baseDim = 1080;
  return Math.max(0.5, Math.min(1.4, minDim / baseDim));
}

function getTreePosition(canvasWidth: number, canvasHeight: number) {
  const scale = getResponsiveScale(canvasWidth, canvasHeight);
  // 樱花树放在右侧，与左侧欢迎语垂直对称
  if (canvasWidth < 640) {
    return { startX: canvasWidth * 0.85, startY: canvasHeight * 0.9, scale: scale * 0.6 };
  } else if (canvasWidth < 1024) {
    return { startX: canvasWidth * 0.82, startY: canvasHeight * 0.88, scale: scale * 0.75 };
  } else {
    return { startX: canvasWidth * 0.78, startY: canvasHeight * 0.88, scale: scale * 0.9 };
  }
}

// ============================================
// 花朵数据
// ============================================
interface FlowerData {
  x: number; y: number; size: number; color: string;
  brightness: number;
}

interface LeafData {
  x: number; y: number; size: number; angle: number;
  color: string;
}

// ============================================
// 静态花瓣（装饰用，不飘落）
// ============================================
interface StaticPetal {
  x: number; y: number; size: number; rotation: number;
  color: string; shapeType: number;
}

// ============================================
// 树枝类 - 纯静态渲染
// ============================================
class Branch {
  startX = 0; startY = 0; endX = 0; endY = 0;
  angle = 0; length = 0; width = 0;
  depth = 0; maxDepth = 0; curve = 0;
  children: Branch[] = [];
  flowers: FlowerData[] = [];
  leaves: LeafData[] = [];

  constructor(x: number, y: number, angle: number, length: number, width: number, depth: number, maxDepth: number) {
    this.startX = x; this.startY = y;
    this.angle = angle; this.length = length; this.width = width;
    this.depth = depth; this.maxDepth = maxDepth;
    this.curve = (Math.random() - 0.5) * 0.2;
    this.endX = x + Math.cos(angle) * length;
    this.endY = y + Math.sin(angle) * length;

    if (depth < maxDepth) {
      const numBranches = depth < 2 ? 2 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numBranches; i++) {
        const newAngle = angle + (Math.random() - 0.5) * CONFIG.tree.branchAngle * 2;
        const newLength = length * CONFIG.tree.lengthDecay * (0.8 + Math.random() * 0.3);
        const newWidth = width * CONFIG.tree.widthDecay;
        this.children.push(new Branch(this.endX, this.endY, newAngle, newLength, newWidth, depth + 1, maxDepth));
      }

      if (depth >= maxDepth - 3 && depth < maxDepth) {
        const leafCount = 3 + Math.floor(Math.random() * 5);
        for (let i = 0; i < leafCount; i++) {
          const t = Math.random();
          const lx = this.startX + (this.endX - this.startX) * t;
          const ly = this.startY + (this.endY - this.startY) * t;
          const leafAngle = Math.random() * Math.PI * 2;
          this.leaves.push({
            x: lx + Math.cos(leafAngle) * (5 + Math.random() * 12),
            y: ly + Math.sin(leafAngle) * (5 + Math.random() * 12),
            size: 2 + Math.random() * 3,
            angle: leafAngle,
            color: `hsla(${100 + Math.random() * 40}, 50%, 25%, ${0.3 + Math.random() * 0.3})`,
          });
        }
      }
    } else {
      const flowerCount = 20 + Math.floor(Math.random() * 15);
      for (let i = 0; i < flowerCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 80;
        const colorCfg = CONFIG.petals.colors[Math.floor(Math.random() * CONFIG.petals.colors.length)];
        this.flowers.push({
          x: this.endX + Math.cos(angle) * dist,
          y: this.endY + Math.sin(angle) * dist,
          size: 1.5 + Math.random() * 3,
          color: `rgba(${colorCfg.r}, ${colorCfg.g}, ${colorCfg.b}, ${colorCfg.a})`,
          brightness: Math.random(),
        });
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const darkness = 1 - (this.depth / this.maxDepth) * 0.4;
    const r = Math.floor(45 * darkness);
    const g = Math.floor(30 * darkness);
    const b = Math.floor(22 * darkness);

    // 阴影
    if (this.width > 3) {
      ctx.strokeStyle = `rgba(${Math.floor(r * 0.5)},${Math.floor(g * 0.5)},${Math.floor(b * 0.5)}, 0.3)`;
      ctx.lineWidth = this.width + 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.startX + 2, this.startY + 2);
      const cpX = (this.startX + this.endX) / 2 + Math.cos(this.angle + this.curve) * this.length * 0.2 + 2;
      const cpY = (this.startY + this.endY) / 2 + Math.sin(this.angle + this.curve) * this.length * 0.2 + 2;
      ctx.quadraticCurveTo(cpX, cpY, this.endX + 2, this.endY + 2);
      ctx.stroke();
    }

    // 主树枝
    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    const cpX = (this.startX + this.endX) / 2 + Math.cos(this.angle + this.curve) * this.length * 0.2;
    const cpY = (this.startY + this.endY) / 2 + Math.sin(this.angle + this.curve) * this.length * 0.2;
    ctx.quadraticCurveTo(cpX, cpY, this.endX, this.endY);
    ctx.stroke();

    // 树皮纹理
    if (this.width > 6 && this.depth < 3) {
      ctx.strokeStyle = `rgba(${Math.floor(r * 0.7)},${Math.floor(g * 0.7)},${Math.floor(b * 0.7)}, 0.4)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 2; i++) {
        const offset = (i === 0 ? 1 : -1) * this.width * 0.3;
        ctx.beginPath();
        ctx.moveTo(this.startX + offset, this.startY);
        ctx.quadraticCurveTo(cpX + offset, cpY, this.endX + offset, this.endY);
        ctx.stroke();
      }
    }

    // 树叶
    this.leaves.forEach(leaf => {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.angle);
      ctx.fillStyle = leaf.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 花朵 - 高清多层渲染
    this.flowers.forEach(flower => {
      // 外层光晕
      ctx.fillStyle = flower.color.replace(/[\d\.]+\)$/, '0.15)');
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, flower.size * 5, 0, Math.PI * 2);
      ctx.fill();

      // 中层光晕
      ctx.fillStyle = flower.color.replace(/[\d\.]+\)$/, '0.35)');
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, flower.size * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 主花瓣
      ctx.fillStyle = flower.color;
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, flower.size, 0, Math.PI * 2);
      ctx.fill();

      // 花蕊高光
      ctx.fillStyle = `rgba(255,255,255,${0.6 + flower.brightness * 0.4})`;
      ctx.beginPath();
      ctx.arc(flower.x - flower.size * 0.2, flower.y - flower.size * 0.2, flower.size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });

    this.children.forEach(child => {
      child.startX = this.endX;
      child.startY = this.endY;
      child.draw(ctx);
    });
  }
}

// ============================================
// React 组件 - 完全静态渲染
// ============================================
export default function SakuraScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let tree: Branch | null = null;

    const generateStaticPetals = (w: number, h: number): StaticPetal[] => {
      const petals: StaticPetal[] = [];
      for (let i = 0; i < CONFIG.petals.count; i++) {
        const colorCfg = CONFIG.petals.colors[Math.floor(Math.random() * CONFIG.petals.colors.length)];
        petals.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.7,
          size: CONFIG.petals.minSize + Math.random() * (CONFIG.petals.maxSize - CONFIG.petals.minSize),
          rotation: Math.random() * Math.PI * 2,
          color: `rgba(${colorCfg.r}, ${colorCfg.g}, ${colorCfg.b}, ${colorCfg.a})`,
          shapeType: Math.floor(Math.random() * 3),
        });
      }
      return petals;
    };

    const drawStaticPetal = (ctx: CanvasRenderingContext2D, petal: StaticPetal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.fillStyle = petal.color;

      if (petal.shapeType === 0) {
        ctx.beginPath();
        ctx.ellipse(0, 0, petal.size * 0.8, petal.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (petal.shapeType === 1) {
        const s = petal.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.5);
        ctx.bezierCurveTo(-s, -s * 1.2, -s * 1.2, 0, 0, s);
        ctx.bezierCurveTo(s * 1.2, 0, s, -s * 1.2, 0, -s * 0.5);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, petal.size * 0.6, 0.2, Math.PI * 2 - 0.2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawScene = () => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. 天空背景
      ctx.fillStyle = "#0a0a15";
      ctx.fillRect(0, 0, w, h);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, "#0a0a15");
      skyGrad.addColorStop(0.4, "#121025");
      skyGrad.addColorStop(0.7, "#1a1528");
      skyGrad.addColorStop(1, "#1e1820");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. 静态星星（无闪烁）
      for (let i = 0; i < 60; i++) {
        const x = ((Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) / 2) * w;
        const y = ((Math.sin(i * 78.233) * 43758.5453 % 1 + 1) / 2) * h * 0.7;
        const size = 0.5 + ((Math.sin(i * 43.123) * 43758.5453 % 1 + 1) / 2) * 1.5;
        const brightness = 0.5 + ((Math.sin(i * 91.345) * 43758.5453 % 1 + 1) / 2) * 0.5;

        ctx.globalAlpha = brightness;
        ctx.fillStyle = i % 5 === 0 ? "rgba(200, 210, 255, 0.9)" : "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 3. 静态飘落花瓣（装饰用，不动画）
      const staticPetals = generateStaticPetals(w, h);
      staticPetals.forEach(petal => drawStaticPetal(ctx, petal));

      // 4. 地面
      const groundY = h * 0.88;

      const baseGrad = ctx.createLinearGradient(0, groundY, 0, h);
      baseGrad.addColorStop(0, "#1a1510");
      baseGrad.addColorStop(0.3, "#15100c");
      baseGrad.addColorStop(0.7, "#100c08");
      baseGrad.addColorStop(1, "#0a0805");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // 土壤斑块
      const soilColors = ["#1e1814", "#241e18", "#1a1510", "#282018", "#1c1612", "#201a14"];
      for (let i = 0; i < 15; i++) {
        const px = ((Math.sin(i * 91.345) * 43758.5453 % 1 + 1) / 2) * w;
        const py = groundY + ((Math.sin(i * 34.567) * 43758.5453 % 1 + 1) / 2) * (h - groundY);
        const size = 5 + ((Math.sin(i * 56.789) * 43758.5453 % 1 + 1) / 2) * 18;
        ctx.fillStyle = soilColors[i % soilColors.length];
        ctx.beginPath();
        ctx.ellipse(px, py, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(40, 32, 24, 0.2)";
      for (let i = 0; i < 60; i++) {
        const px = ((Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) / 2) * w;
        const py = groundY + ((Math.sin(i * 78.233) * 43758.5453 % 1 + 1) / 2) * (h - groundY);
        const ps = 0.5 + ((Math.sin(i * 43.123) * 43758.5453 % 1 + 1) / 2) * 1.2;
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fill();
      }

      // 石头
      const stoneColors = ["#3a3028", "#4a3f35", "#2d2420", "#453a30", "#352d26", "#3d3328"];
      for (let i = 0; i < 6; i++) {
        const sx = ((Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) / 2) * w;
        const sy = groundY + 5 + ((Math.sin(i * 78.233) * 43758.5453 % 1 + 1) / 2) * (h - groundY - 20);
        const rx = 3 + ((Math.sin(i * 43.123) * 43758.5453 % 1 + 1) / 2) * 8;
        const ry = 2 + ((Math.sin(i * 23.451) * 43758.5453 % 1 + 1) / 2) * 5;
        const rotation = ((Math.sin(i * 67.890) * 43758.5453 % 1 + 1) / 2) * Math.PI;
        ctx.fillStyle = stoneColors[i % stoneColors.length];
        ctx.beginPath();
        ctx.ellipse(sx, sy, rx, ry, rotation, 0, Math.PI * 2);
        ctx.fill();
      }

      // 草地
      for (let i = 0; i < CONFIG.ground.grassCount; i++) {
        const gx = (i / CONFIG.ground.grassCount) * w + (Math.sin(i * 12.9898) * 43758.5453 % 1) * 15;
        const gHeight = CONFIG.ground.grassHeight * (0.4 + ((Math.sin(i * 78.233) * 43758.5453 % 1 + 1) / 2) * 0.6);
        const gLean = ((Math.sin(i * 43.123) * 43758.5453 % 1 + 1) / 2 - 0.5) * 14;
        const gHue = 95 + ((Math.sin(i * 23.451) * 43758.5453 % 1 + 1) / 2) * 50;
        const gLightness = 22 + ((Math.sin(i * 67.890) * 43758.5453 % 1 + 1) / 2) * 15;
        ctx.strokeStyle = `hsla(${gHue}, 45%, ${gLightness}%, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(gx, groundY);
        ctx.quadraticCurveTo(gx + gLean * 0.5, groundY - gHeight * 0.5, gx + gLean, groundY - gHeight);
        ctx.stroke();
      }

      // 落花瓣
      for (let i = 0; i < 25; i++) {
        const colorCfg = CONFIG.petals.colors[Math.floor(((Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) / 2) * CONFIG.petals.colors.length)];
        const px = ((Math.sin(i * 45.678) * 43758.5453 % 1 + 1) / 2) * w;
        const py = groundY + ((Math.sin(i * 89.012) * 43758.5453 % 1 + 1) / 2) * (h - groundY) * 0.3;
        const pSize = 1.5 + ((Math.sin(i * 23.456) * 43758.5453 % 1 + 1) / 2) * 3.5;
        const pRotation = ((Math.sin(i * 67.890) * 43758.5453 % 1 + 1) / 2) * Math.PI * 2;
        ctx.fillStyle = `rgba(${colorCfg.r}, ${colorCfg.g}, ${colorCfg.b}, ${0.3 + ((Math.sin(i * 34.567) * 43758.5453 % 1 + 1) / 2) * 0.3})`;
        ctx.beginPath();
        ctx.ellipse(px, py, pSize, pSize * 0.6, pRotation, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. 樱花树
      if (tree) {
        tree.draw(ctx);
      }
    };

    const resizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      const pos = getTreePosition(w, h);
      tree = new Branch(pos.startX, pos.startY, -Math.PI / 2, CONFIG.tree.trunkLength * pos.scale, CONFIG.tree.trunkWidth * pos.scale, 0, CONFIG.tree.maxDepth);

      drawScene();
    };

    resizeCanvas();

    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}