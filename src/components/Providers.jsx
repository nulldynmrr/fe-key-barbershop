"use client";

import GoogleAuthProviderWrapper from "@/components/GoogleAuthProvider";

import { ToastProvider } from "@/contexts/ToastContext";

export default function Providers({ children }) {
  return (
    <GoogleAuthProviderWrapper>
      <ToastProvider>
        {children}
      </ToastProvider>
    </GoogleAuthProviderWrapper>
  );
}

