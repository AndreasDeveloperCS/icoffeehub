module.exports = {
  apps: [
    {
      name: 'icoffeehub-backend',
      cwd: '/var/www/icoffeehub/backend',
      script: 'dist/main.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },

    {
      name: 'icoffeehub-frontend',
      cwd: '/var/www/icoffeehub/frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
