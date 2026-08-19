"use client";

import { useEffect, useRef } from "react";

export function useFullScroll(
  sectionSelector: string = ".snap-section",
  options: {
    scrollDuration?: number;
    allowLastSectionScroll?: boolean;
  } = {}
) {
  const {
    scrollDuration = 300,
    allowLastSectionScroll = true,
  } = options;

  const isScrollingRef = useRef(false);

  useEffect(() => {
    const scrollToSection = (direction: "next" | "prev") => {
      if (isScrollingRef.current) return;

      const sections = document.querySelectorAll(sectionSelector);
      if (sections.length === 0) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      const viewportCenter = scrollPosition + windowHeight / 2;
      let currentIndex = -1;

      sections.forEach((section, index) => {
        const el = section as HTMLElement;
        const sectionTop = el.offsetTop;
        const sectionBottom = sectionTop + el.offsetHeight;
        if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
          currentIndex = index;
        }
      });

      let targetSection: HTMLElement | null = null;

      if (direction === "next") {
        if (currentIndex >= 0 && currentIndex < sections.length - 1) {
          targetSection = sections[currentIndex + 1] as HTMLElement;
        } else if (currentIndex === sections.length - 1 && allowLastSectionScroll) {
          const lastSection = sections[sections.length - 1] as HTMLElement;
          const lastBottom = lastSection.offsetTop + lastSection.offsetHeight;
          isScrollingRef.current = true;
          window.scrollTo({
            top: Math.max(0, lastBottom - windowHeight),
            behavior: "smooth",
          });
          setTimeout(() => {
            isScrollingRef.current = false;
          }, scrollDuration);
          return;
        }
      } else {
        if (currentIndex > 0) {
          targetSection = sections[currentIndex - 1] as HTMLElement;
        }
      }

      if (targetSection) {
        isScrollingRef.current = true;
        const targetTop = (targetSection as HTMLElement).offsetTop;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, scrollDuration);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        scrollToSection("next");
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToSection("prev");
      } else if (e.key === "Home") {
        e.preventDefault();
        isScrollingRef.current = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, scrollDuration);
      } else if (e.key === "End") {
        e.preventDefault();
        const sections = document.querySelectorAll(sectionSelector);
        if (sections.length > 0 && allowLastSectionScroll) {
          isScrollingRef.current = true;
          const lastSection = sections[sections.length - 1] as HTMLElement;
          const lastBottom = lastSection.offsetTop + lastSection.offsetHeight;
          window.scrollTo({
            top: Math.max(0, lastBottom - window.innerHeight),
            behavior: "smooth",
          });
          setTimeout(() => {
            isScrollingRef.current = false;
          }, scrollDuration);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sectionSelector, scrollDuration, allowLastSectionScroll]);

  return { isScrollingRef };
}