"use client";

import { NavProvider } from "@/context/NavContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <NavProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </NavProvider>
  );
}