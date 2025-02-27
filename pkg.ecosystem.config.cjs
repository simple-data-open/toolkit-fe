module.exports = {
  apps: [
    {
      name: 'pkg/system',
      script: 'cd packages/system && npm run dev',
    },
    {
      name: 'pkg/utils',
      script: 'cd packages/utils && npm run dev',
    },
    {
      name: 'pkg/logger',
      script: 'cd packages/logger && npm run dev',
    },
    {
      name: 'pkg/editor-theme',
      script: 'cd packages/editor-theme && npm run dev',
    },
    {
      name: 'pkg/editor-theme@watch',
      script: 'cd packages/editor-theme && npm run watch',
    },
    {
      name: 'pkg/editor-ui',
      script: 'cd packages/editor-ui && npm run dev',
    },
    {
      name: 'pkg/ext-connector',
      script: 'cd packages/ext-connector && npm run dev',
    },
    {
      name: 'pkg/ext-adapter',
      script: 'cd packages/ext-adapter && npm run dev',
    },
    {
      name: 'pkg/editor-inh-sdk',
      script: 'cd packages/editor-inh-sdk && npm run dev',
    },
    {
      name: 'pkg/editor-opt',
      script: 'cd packages/editor-opt && npm run dev',
    },
  ],
};
