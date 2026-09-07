"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, type ReactNode } from "react";

const GoogleAuthContext = createContext(false);

export function useGoogleAuthEnabled() {
  return useContext(GoogleAuthContext);
}

export function AuthSessionProvider({
  googleEnabled,
  children,
}: {
  googleEnabled: boolean;
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <GoogleAuthContext.Provider value={googleEnabled}>{children}</GoogleAuthContext.Provider>
    </SessionProvider>
  );
}
