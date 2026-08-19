"use client";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 200 }: LogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 300"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M100 20 L85 50 L115 50 Z" />
      <path d="M50 50 L150 50 L165 70 L35 70 Z" />
      <path d="M35 70 L100 120 L165 70 L170 110 L30 110 Z" opacity="0.9" />
      <path d="M30 110 L100 180 L170 110 L168 145 L32 145 Z" opacity="0.85" />
      <path d="M32 145 L100 220 L168 145 L163 180 L37 180 Z" opacity="0.8" />
      <path d="M37 180 L100 245 L163 180 L155 215 L45 215 Z" opacity="0.75" />
      <path d="M45 215 L100 275 L155 215 L142 245 L58 245 Z" opacity="0.7" />
      <path d="M58 245 L100 285 L142 245 L125 265 L75 265 Z" opacity="0.65" />
      <path d="M75 265 L100 290 L125 265 L110 278 L90 278 Z" opacity="0.6" />
      <path d="M100 50 L100 290" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M35 70 L165 70" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  );
}