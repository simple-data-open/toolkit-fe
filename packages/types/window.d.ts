declare global {
  interface Window {
    openDebug: (ws: string) => void;
    closeDebug: () => void;
  }
}

export {};
