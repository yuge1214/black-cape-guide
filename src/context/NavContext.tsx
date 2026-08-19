"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface NavContextType {
  showNavLinks: boolean;
  setShowNavLinks: (val: boolean) => void;
}

const NavContext = createContext<NavContextType>({
  showNavLinks: false,
  setShowNavLinks: () => {},
});

export function NavProvider({ children }: { children: ReactNode }) {
  const [showNavLinks, setShowNavLinks] = useState(false);

  return (
    <NavContext.Provider value={{ showNavLinks, setShowNavLinks }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNavContext() {
  return useContext(NavContext);
}