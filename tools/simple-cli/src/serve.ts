import cors from '@fastify/cors';

import fastify from 'fastify';
import FastifySoketIO from 'fastify-socket.io';
import kleur from 'kleur';
import os from 'os';
import { DefaultEventsMap, Socket } from 'socket.io';

import { logger } from './logger';

type SocketClient = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

const ifaces = os.networkInterfaces();
const app = fastify();

const protocol = 'http://';

const printAddress = (port: number) => {
  Object.keys(ifaces).forEach(function (dev) {
    if (ifaces[dev]) {
      ifaces[dev].forEach(function (details) {
        if (details.family === 'IPv4') {
          logger(protocol + details.address + ':' + port.toString());
        }
      });
    }
  });
};

/** 连接基座存储(browser 端) */
const docks = new Map<string, SocketClient>();
/** 连接的扩展存储(node 端) */
const extensions = new Map<string, SimpleExtSpace.Manifest>();

function printAfterRefresh() {
  logger(kleur.green(`[Extension list] - ${Date().toString()}`));
  extensions.forEach(ext => {
    logger(kleur.yellow('  -'), ext.name, ext.version);
  });
}

export async function serve({ port = 9999 }: { port: number }) {
  await app.register(FastifySoketIO as any, {
    cors: {
      origin: '*',
    },
  });
  await app.register(cors, {
    origin: '*',
  });

  app.get('/', (_req, _reply) => {
    return { hello: 'world' };
  });

  app.ready(err => {
    if (err) throw err;

    app.io.on('connection', (client: SocketClient) => {
      client.on('extension-connect', data => {
        extensions.set(client.id, data);

        printAfterRefresh();
      });
      client.on('extension-reload', data => {
        docks.forEach(dock => {
          dock.emit('extension-reload', data);
          logger(kleur.green(`[Reload] - ${Date().toString()}`));
          logger(kleur.blue(` - ${data.name}`));
        });
      });

      client.on('dock-connect', () => {
        docks.set(client.id, client);
        client.emit('debug-extensions', {
          extensions: Array.from(extensions).map(([_, e]) => e),
        });
      });

      client.on('disconnect', () => {
        docks.delete(client.id);
        extensions.delete(client.id);
        printAfterRefresh();
      });
    });
  });

  app.listen({ host: '0.0.0.0', port });
  printAddress(port);
}
