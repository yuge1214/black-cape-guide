"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  animation = "up",
  delay = 0,
  threshold = 0.5,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              setTimeout(() => {
                entry.target.classList.add("active");
              }, delay);
            });
          } else {
            entry.target.classList.remove("active");
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: "-5% 0px -5% 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [delay, threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case "up":
        return "reveal";
      case "down":
        return "reveal-down";
      case "left":
        return "reveal-left";
      case "right":
        return "reveal-right";
      case "scale":
        return "reveal-scale";
      default:
        return "reveal";
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : {}}
    >
      {children}
    </div>
  );
}