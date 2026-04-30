"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "#121212",
          border: "1px solid #2f2f2f",
          color: "#f4f4f5",
        },
      }}
    />
  );
}
