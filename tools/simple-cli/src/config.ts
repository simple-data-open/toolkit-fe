import { constants, createPublicKey, publicEncrypt } from 'crypto';
import envPaths from 'env-paths';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export type EnvType = 'dev' | 'test' | 'prod';

export interface ConfigModel {
  active: EnvType;
  envs: {
    dev: {
      url: string;
      token: string;
    };
    test: {
      url: string;
      token: string;
    };
    prod: {
      url: string;
      token: string;
    };
  };
}

const devPublicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4OKalpMYrx7sfnRRS4Xz
f7CUdZB4f1oeELkcV14M5jIgbLT9QWAxEGdid/ans9CVpjcgTAdwIJDQwW6vqIBB
VEpj7QQ1cQit1yGIONIwISRhHisGziMxID9AYvJlSMW0B0j187B+JTznuPM7U38D
QI/9Y5RULVbX7w6f2tyzi7iDiwqFqRwVgYEMdcPVhSOJTZx4MpQvVJVkRv8Gb3hz
BwRbFeJ7AzyMVarxGZ0/Jju1xxst8KwbbvLMVABUp003D2W95cLl15CGPEiU2hRl
QIH/XkyGA1GkCBrUrAhmfZYqew7knXOTNISgYcXSrUZAyioeTxCLgPzpva8RfK9/
nwIDAQAB
-----END PUBLIC KEY-----
`;

const publicKeys = {
  dev: devPublicKey,
  test: devPublicKey,
  prod: devPublicKey,
};

/**
 * 使用 Node.js 原生 crypto 对字符串进行 RSA 加密，返回 Base64 编码的密文
 * @param {string} content 明文
 * @param {string} publicKey PEM 格式的公钥
 */
export function encrypt(content: string, _env: EnvType) {
  const publicKey = publicKeys[_env];
  // 将 PEM 格式公钥转换为 KeyObject
  const keyObject = createPublicKey(publicKey);

  // 使用 RSA_PKCS1_PADDING（和 JSEncrypt 默认配置一致）
  const encryptedBuffer = publicEncrypt(
    {
      key: keyObject,
      padding: constants.RSA_PKCS1_PADDING, // PKCS#1 padding
    },
    Buffer.from(content, 'utf8'),
  );

  // 转成 Base64 字符串
  return encryptedBuffer.toString('base64');
}

export const defaultConfig: ConfigModel = {
  active: 'dev',
  envs: {
    dev: {
      url: 'http://localhost:3000',
      token: '',
    },
    test: {
      url: 'http://localhost:3000',
      token: '',
    },
    prod: {
      url: 'http://localhost:3000',
      token: '',
    },
  },
};

const getConfigPath = (name: string) =>
  path.join(envPaths(name).config, 'config.json');

export function initializeConfig(name: string) {
  const paths = envPaths(name);

  const configPath = path.join(paths.config, 'config.json');
  // 判断是否存在 config 目录, 不存在则直接创建
  if (!existsSync(paths.config)) {
    mkdirSync(paths.config, { recursive: true });
  }
  // 判断是否存在 config.json 文件, 不存在则直接创建
  if (!existsSync(configPath)) {
    mkdirSync(paths.config, { recursive: true });
    writeFileSync(configPath, JSON.stringify(defaultConfig));
  }
}

export function getConfig(name: string): ConfigModel {
  return JSON.parse(readFileSync(getConfigPath(name), 'utf-8'));
}

export function saveConfig(name: string, config: ConfigModel) {
  writeFileSync(getConfigPath(name), JSON.stringify(config));
}

export function storeToken(name: string, env: EnvType, token: string) {
  const config = getConfig(name);
  config.envs[env].token = token;
  saveConfig(name, config);
}
