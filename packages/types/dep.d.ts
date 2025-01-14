declare global {
  namespace DepSpace {
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
