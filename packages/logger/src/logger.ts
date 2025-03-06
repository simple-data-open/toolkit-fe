/*
 * File Created: Thursday, 26th December 2024 12:27:53 am
 * Author: xiaoYown (qzy09101018@gmail.com)
 * -----
 * Last Modified: Thursday, 26th December 2024 12:34:39 am
 * Modified By: xiaoYown (qzy09101018@gmail.com>)
 */
// logger.js
import { LogLevels } from './log-levels';

type LevelType = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

interface LoggerOptions {
  level?: LevelType;
  enabled?: boolean;
}

/**
 * 一个简易的前端日志库
 * - 支持多级别日志输出（debug, info, warn, error）
 * - 支持最小输出等级配置
 * - 支持日志开启/关闭
 * - 支持彩色输出
 */
export class Logger {
  // 私有属性/字段（仅可在此 class 中使用）
  #enabled;
  #level;
  #styles;

  /**
   * 创建一个 Logger 实例
   * @param {object} options - 配置项
   * @param {('DEBUG'|'INFO'|'WARN'|'ERROR'|'OFF')} [options.level='DEBUG'] - 最小日志输出等级
   * @param {boolean} [options.enabled=true] - 是否启用日志
   */
  constructor(options: LoggerOptions = {}) {
    const { level = 'WARN', enabled = true } = options;

    // 是否启用日志
    this.#enabled = enabled;
    // 当前最小输出等级（超过或等于此等级才会输出）
    this.#level = LogLevels[level];

    // 每个日志等级对应的样式（也定义为私有属性）
    this.#styles = {
      [LogLevels.DEBUG]:
        'background: #eee;     color: #888;    padding: 2px 4px; border-radius: 3px;',
      [LogLevels.INFO]:
        'background: #2196f3;  color: #fff;    padding: 2px 4px; border-radius: 3px;',
      [LogLevels.WARN]:
        'background: #ff9800;  color: #fff;    padding: 2px 4px; border-radius: 3px;',
      [LogLevels.ERROR]:
        'background: #f44336;  color: #fff;    padding: 2px 4px; border-radius: 3px;',
    };
  }

  /**
   * 设置日志等级
   * @param {('DEBUG'|'INFO'|'WARN'|'ERROR'|'OFF')} level - 新的日志等级
   */
  setLevel(level) {
    this.#level = LogLevels[level] ?? LogLevels.DEBUG;
  }

  /**
   * 开启日志输出
   */
  enable() {
    this.#enabled = true;
  }

  /**
   * 关闭日志输出
   */
  disable() {
    this.#enabled = false;
  }

  /**
   * 判断当前等级是否允许输出 (私有方法)
   * @param {number} level - 日志等级数字值
   * @returns {boolean} 是否可输出
   */
  private canLog(level) {
    return this.#enabled && level >= this.#level && this.#level < LogLevels.OFF;
  }

  /**
   * 输出 debug 级别日志
   * @param  {...any} args - 任意待输出内容
   */
  debug(...args) {
    const levelValue = LogLevels.DEBUG;
    if (!this.canLog(levelValue)) return;

    console.log('%c[DEBUG]', this.#styles[levelValue], ...args);
  }

  /**
   * 输出 info 级别日志
   * @param  {...any} args - 任意待输出内容
   */
  info(...args) {
    const levelValue = LogLevels.INFO;
    if (!this.canLog(levelValue)) return;

    console.log('%c[INFO ]', this.#styles[levelValue], ...args);
  }

  /**
   * 输出 warn 级别日志
   * @param  {...any} args - 任意待输出内容
   */
  warn(...args) {
    const levelValue = LogLevels.WARN;
    if (!this.canLog(levelValue)) return;

    console.warn('%c[WARN ]', this.#styles[levelValue], ...args);
  }

  /**
   * 输出 error 级别日志
   * @param  {...any} args - 任意待输出内容
   */
  error(...args) {
    const levelValue = LogLevels.ERROR;
    if (!this.canLog(levelValue)) return;

    console.error('%c[ERROR]', this.#styles[levelValue], ...args);
  }
}
