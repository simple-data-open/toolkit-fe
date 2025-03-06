import type { Logger } from '@simple-data-open/logger';

export type ToastOptions = {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
};

declare global {
  interface Window {
    SimpleSDK: SimpleSDK;
  }
  /** editor/reader common sdk */
  interface SimpleSDK {
    /** 进入开发模式 */
    openDebug: (ws: string) => void;
    /** 退出开发模式 */
    closeDebug: () => void;
    /** 日志打印 */
    logger: Logger;
    /** 消息提示 */
    toast: (options: ToastOptions) => void;
    /** 颜色转换 */
    color: {
      fromStorage: (color: string) => string;
      toStorage: (hex: string, opacity: number) => string;
      toHexa: (color: string) => { hex: string; hexa: string; alpha: number };
      toRgba: (color: string) => { r: number; g: number; b: number; a: number };
    };
  }
}

export {};
