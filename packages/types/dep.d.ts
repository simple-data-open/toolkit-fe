declare global {
  namespace SimpleDepSpace {
    interface DepModel {
      name: string;
      version: string;
      schema: string;
      css: boolean;
      dependences?: Record<string, string> | null;
    }
  }
}
export {};
