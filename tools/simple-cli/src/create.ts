import fs from 'node:fs';
import path from 'node:path';

/**
 * Gitee 下载参数
 */
interface DownloadGiteeOptions {
  owner: string; // Gitee 用户名或组织名
  repo: string; // 仓库名
  branch?: string; // 分支，默认 'main' 或 'master'
  giteeToken?: string; // 如果要下载私有仓库，或者防止 API 限速，可传入 Gitee Token
}

/**
 * 创建命令选项
 */
interface CommandOptions {
  name: string;
}

/**
 * 从 Gitee 获取指定 path 的目录/文件列表，并将内容下载到本地
 * @param currentPath - 仓库内需要下载的目录路径
 * @param localDir    - 本地下载到的目录路径
 * @param options     - 下载参数（owner、repo、branch、giteeToken）
 */
export async function downloadGiteeDirectory({
  currentPath,
  localDir,
  options,
  cmdOptions,
}: {
  currentPath: string;
  localDir: string;
  options: DownloadGiteeOptions;
  cmdOptions: CommandOptions;
}): Promise<void> {
  const { owner, repo, branch = 'main', giteeToken } = options;

  // 构造 Gitee API URL
  // https://gitee.com/api/v5/repos/{owner}/{repo}/contents/{path}?ref={branch}
  const apiUrl = `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${currentPath}?ref=${branch}`;

  // 如果有 Token，就添加到请求头
  const headers: Record<string, string> = {};
  if (giteeToken) {
    headers.Authorization = `token ${giteeToken}`;
  }

  console.log(`Fetching: ${apiUrl}`);
  const res = await fetch(apiUrl, { headers }); // 使用 Node.js 18+ 原生 fetch
  if (!res.ok) {
    throw new Error(
      `Gitee API 请求失败。status = ${res.status}, statusText = ${res.statusText}`,
    );
  }

  // Gitee 返回的目录内容
  // 结构与 GitHub 类似: [{ name, path, type, download_url }, ...]
  const items: Array<{
    name: string;
    path: string;
    type: 'file' | 'dir';
    download_url: string | null;
  }> = await res.json();

  // 如果不是数组，说明当前路径不是目录
  if (!Array.isArray(items)) {
    throw new Error(`指定路径不是一个有效目录: ${currentPath}`);
  }

  // 确保本地目录存在
  fs.mkdirSync(localDir, { recursive: true });

  for (const item of items) {
    if (item.type === 'dir') {
      // 如果是子目录，递归下载
      await downloadGiteeDirectory({
        currentPath: item.path,
        localDir: path.join(localDir, item.name),
        options,
        cmdOptions: cmdOptions,
      });
    } else if (item.type === 'file') {
      // 如果是文件，则下载
      if (!item.download_url) {
        console.warn(`找不到文件下载地址: ${item.path}`);
        continue;
      }
      console.log(`Downloading file: ${item.path}`);

      const fileRes = await fetch(item.download_url, { headers });
      if (!fileRes.ok) {
        throw new Error(
          `文件下载失败: ${item.path}, status = ${fileRes.status}`,
        );
      }

      // 将响应转换为 Buffer 并写入本地文件
      const fileBuffer = Buffer.from(await fileRes.arrayBuffer());
      const localFilePath = path.join(localDir, item.name);
      if (item.name === 'package.json') {
        const pkg = JSON.parse(fileBuffer.toString());
        pkg.name = cmdOptions.name;
        fs.writeFileSync(localFilePath, JSON.stringify(pkg, null, 2));
      } else {
        fs.writeFileSync(localFilePath, fileBuffer);
      }
    }
  }
}

/**
 * 示例使用
 */
export async function create(options: { name: string }) {
  try {
    // 指定要下载的 Gitee 仓库信息
    const downloadOptions: DownloadGiteeOptions = {
      owner: 'simple-data-open', // Gitee 用户/组织
      repo: 'toolkit-fe', // 仓库名
      branch: 'main', // 分支 (也可能是 'master')
      // giteeToken: 'xxxx'       // 如果需要下载私有仓库或加速，可填写
    };

    // 指定要下载的仓库目录，如 "templates/canvas" 等
    const remotePath = 'templates/canvas';

    // 指定下载到本地的目录
    const localPath = path.resolve(options.name);

    // 调用下载函数
    await downloadGiteeDirectory({
      currentPath: remotePath,
      localDir: localPath,
      options: downloadOptions,
      cmdOptions: options,
    });

    console.log('下载完成！');
  } catch (error) {
    console.error(`下载失败: ${(error as Error).message}`);
  }
}
