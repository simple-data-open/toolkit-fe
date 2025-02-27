import archiver from 'archiver';
import FormData from 'form-data';
import kleur from 'kleur';
import fetch from 'node-fetch';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { premove } from 'premove';
import semver from 'semver';

import { getToken, getUrl } from './config';
import { logger } from './logger';

function compressing(folder: string, dest: string) {
  return new Promise((resolve, reject) => {
    // create a file to stream archive data to.
    const output = fs.createWriteStream(dest);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
      resolve(null);
      logger(kleur.green(Math.floor(archive.pointer() / 102.4) / 10 + 'kb'));
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    // output.on('end', function () {
    //   console.log('Data has been drained');
    // });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        reject(err);
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      reject(err);
    });

    // pipe archive data to the file
    archive.pipe(output);

    // // append a file from stream
    // const file1 = __dirname + '/file1.txt';
    // archive.append(fs.createReadStream(file1), { name: 'file1.txt' });

    // // append a file from string
    // archive.append('string cheese!', { name: 'file2.txt' });

    // // append a file from buffer
    // const buffer3 = Buffer.from('buff it!');
    // archive.append(buffer3, { name: 'file3.txt' });

    // // append a file
    // archive.file('file1.txt', { name: 'file4.txt' });

    // // append files from a sub-directory and naming it `new-subdir` within the archive
    // archive.directory('subdir/', 'new-subdir');

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory(`${folder}/`, false);

    // // append files from a glob pattern
    // archive.glob('file*.txt', { cwd: __dirname });

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
  });
}

function isCommandInPath(command) {
  const pathValue = process.env.PATH || '';
  const paths = pathValue.split(path.delimiter);
  return paths.some(p => fs.existsSync(path.join(p, command)));
}

function getCmd() {
  if (isCommandInPath('npx')) {
    return 'npx';
  }
  return 'npx';
}

export async function publish() {
  const { name, version } = JSON.parse(
    fs.readFileSync(path.resolve('./package.json'), { encoding: 'utf-8' }),
  );
  // 校验版本号
  if (!semver.valid(version)) {
    logger(kleur.red('Invalid version'));
    process.exit(1);
  }
  const folder = path.resolve(`dist/${version}`);
  const fileName = `${name}-${version}.zip`;
  const dest = path.resolve(`dist/${fileName}`);
  // 移除同版本目录
  await premove(dest);
  // 构建
  await spawnSync(getCmd(), ['simple-pack', 'build']);
  // 压缩
  await compressing(folder, dest);
  // return;
  // 整合数据到 form data
  const form = new FormData();
  form.append('extension_name', name);
  form.append('version', version);
  form.append('file_name', fileName);

  const fileStream = fs.createReadStream(dest); // Create a readable stream from the file

  form.append('file', fileStream, {
    filename: path.basename(dest), // Optional: specify the file name in the form data
    contentType: 'application/zip', // Optional: specify the content type
  });
  const url = `${getUrl()}/api/developer/extension/publish`;

  // 发布
  const res = await fetch(url, {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders(),
      Cookie: `token=${getToken()}`,
    },
  });
  const { code, message } = (await res.json()) as {
    code: number;
    message: string;
  };

  if (code === 200) {
    logger(kleur.green('Publish success.'));
  } else {
    logger(kleur.red(message));
  }

  await premove(dest);
  process.exit(0);
}
