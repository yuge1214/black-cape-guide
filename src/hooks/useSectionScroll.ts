"use client";

import { useEffect } from "react";

export function useSectionScroll(sectionSelector: string = ".snap-section") {
  useEffect(() => {
    const sections = document.querySelectorAll(sectionSelector);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            // 板块进入视口：添加可见状态，移除离开状态
            section.classList.add("is-visible");
            section.classList.remove("is-leaving");
          } else {
            // 板块离开视口：移除可见状态，添加离开状态
            section.classList.remove("is-visible");
            section.classList.add("is-leaving");
          }
        });
      },
      {
        // 使用较大的 rootMargin 提前触发，让用户在滚动过程中就能感受到过渡
        rootMargin: "-10% 0px -10% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [sectionSelector]);
}