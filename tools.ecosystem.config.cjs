module.exports = {
  apps: [
    {
      name: 'tools/simple-cli',
      script: 'cd tools/simple-cli && bun run dev',
    },
    {
      name: 'tools/simple-pack',
      script: 'cd tools/simple-pack && bun run dev',
    },
  ],
};
