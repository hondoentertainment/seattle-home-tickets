"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const GoogleAuthContext = createContext<boolean | null>(null);

export function useGoogleAuthEnabled() {
  return useContext(GoogleAuthContext);
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/providers")
      .then((response) => (response.ok ? response.json() : {}))
      .then((providers: { google?: unknown }) => {
        if (!cancelled) setGoogleEnabled(Boolean(providers?.google));
      })
      .catch(() => {
        if (!cancelled) setGoogleEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SessionProvider>
      <GoogleAuthContext.Provider value={googleEnabled}>{children}</GoogleAuthContext.Provider>
    </SessionProvider>
  );
}
