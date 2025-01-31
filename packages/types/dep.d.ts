declare global {
  namespace SimpleDepSpace {
    interface DepModel {
      name: string;
      version: string;
      schema: string;
      css: boolean;
      dependencies?: Record<string, string> | null;
    }
  }
}
export {};
