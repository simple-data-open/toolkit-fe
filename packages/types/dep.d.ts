declare global {
  namespace SimpleDepSpace {
    interface DepModel {
      name: string;
      version: string;
      schema_version: string;
      hasCss: boolean;
      dependences?: Record<string, string> | null;
    }
  }
}
export {};
