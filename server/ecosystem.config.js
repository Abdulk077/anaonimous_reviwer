module.es = {
  apps: [
    {
      name: "server",
      script: "./src/index.js",
      instances: 2,
      exec_mode: "cluster",
      interpreter: "node",
      interpreter_args: "--experimental-vm-modules",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
