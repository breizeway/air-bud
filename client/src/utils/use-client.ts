"use client";
import { useMemo } from "react";

export default function useClient() {
  const windowIsReady = useMemo(() => {
    if (typeof window !== "undefined") {
      return true;
    }
    return false;
  }, []);

  const documentIsReady = useMemo(() => {
    if (typeof document !== "undefined") {
      return true;
    }
    return false;
  }, []);

  return {
    window: windowIsReady ? window : undefined,
    document: documentIsReady ? document : undefined,
  };
}
