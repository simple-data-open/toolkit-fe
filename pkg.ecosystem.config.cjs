module.exports = {
  apps: [
    {
      name: 'pkg/system',
      script: 'cd packages/system && bun run dev',
    },
    {
      name: 'pkg/utils',
      script: 'cd packages/utils && bun run dev',
    },
    {
      name: 'pkg/logger',
      script: 'cd packages/logger && bun run dev',
    },
    {
      name: 'pkg/editor-theme',
      script: 'cd packages/editor-theme && bun run dev',
    },
    {
      name: 'pkg/editor-theme@watch',
      script: 'cd packages/editor-theme && bun run watch',
    },
    {
      name: 'pkg/editor-ui',
      script: 'cd packages/editor-ui && bun run dev',
    },
    {
      name: 'pkg/ext-connector',
      script: 'cd packages/ext-connector && bun run dev',
    },
    {
      name: 'pkg/ext-adapter',
      script: 'cd packages/ext-adapter && bun run dev',
    },
    {
      name: 'pkg/editor-inh-sdk',
      script: 'cd packages/editor-inh-sdk && bun run dev',
    },
    {
      name: 'pkg/editor-opt',
      script: 'cd packages/editor-opt && bun run dev',
    },
  ],
};
