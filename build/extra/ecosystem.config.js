module.exports = {
  apps: [
    {
      name: "jotway",
      script: "./dist/main.js",
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
