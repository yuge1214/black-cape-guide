"use client";

import { NavProvider, useNavContext } from "@/context/NavContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

function LayoutContent({ children }: { children: ReactNode }) {
  const { showNavLinks } = useNavContext();

  return (
    <>
      <div className={`transition-opacity duration-500 ${showNavLinks ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Navbar />
      </div>
      <main className="flex-1">{children}</main>
      <div className={`transition-opacity duration-500 ${showNavLinks ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Footer />
      </div>
    </>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <NavProvider>
      <LayoutContent>{children}</LayoutContent>
    </NavProvider>
  );
}