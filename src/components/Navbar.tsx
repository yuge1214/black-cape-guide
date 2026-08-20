"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useNavContext } from "@/context/NavContext";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于我" },
  { href: "/#main-content", label: "最新攻略" },
  { href: "/admin", label: "后台管理" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showNavLinks } = useNavContext();

  const handleReturnToLanding = () => {
    sessionStorage.removeItem("hasStarted");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between pl-0 pr-6 py-4">
        <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            黑蓑影卫攻略组-雨鸽
          </span>

        {showNavLinks && (
          <div className="hidden items-center gap-1 md:flex animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-zinc-400 hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent transition-all duration-300 ${
                    pathname === link.href
                      ? "w-4/5"
                      : "w-0 group-hover:w-3/5"
                  }`}
                />
              </Link>
            ))}
            <button
              onClick={handleReturnToLanding}
              className="ml-2 rounded-md px-4 py-2 text-sm font-medium text-zinc-400 transition-all hover:text-foreground hover:bg-metal-dark border border-border/50 hover:border-accent/50"
              title="返回初始页面"
            >
              返回初始页面
            </button>
          </div>
        )}

        {showNavLinks && (
          <button
            className="md:hidden rounded-md p-2 text-foreground hover:bg-metal-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="切换菜单"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}
      </nav>

      {showNavLinks && mobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden animate-fade-in">
          <div className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-4 py-3 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-metal-mid text-foreground"
                    : "text-zinc-400 hover:bg-metal-dark hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleReturnToLanding();
              }}
              className="mt-2 rounded-md px-4 py-3 text-sm font-medium text-zinc-400 transition-all hover:bg-metal-dark hover:text-foreground border border-border/50"
            >
              返回初始页面
            </button>
          </div>
        </div>
      )}
    </header>
  );
}