const branchName = require('current-git-branch');

function addEnvSuffix(name) {
  return process.env.NODE_ENV + "_" + name;
}


module.exports = {
  apps: [
    {
      name: addEnvSuffix("API"),
      script: "yarn start",
      // args: 'one',
      cwd: "./packages/server",
      instances: 1,
      autorestart: true,
      watch: false,
      //interpreter: "babel-node",
      // max_memory_restart: '1G',
      env_staging: {
        PORT: 9000,
        NODE_ENV: "staging",
      },
      env_production: {
        PORT: 8000,
        NODE_ENV: "production",
      },
    },
    {
      name: addEnvSuffix("IMAGE"),
      script: "yarn start",
      cwd: "./packages/image",
      instances: 1,
      autorestart: true,
      watch: false,
      //interpreter: "babel-node",
      env_staging: {
        PORT: 9010,
        HOST: "https://stg.alacolang.ir/kolbeh",
        NODE_ENV: "staging",
      },
      env_production: {
        PORT: 8010,
        HOST: "https://alacolang.ir/kolbeh",
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "www",
      host: "vps",
      ref: "origin/master",
      repo: "git@github.com:alacolang/kolbeh.git",
      path: "/home/www/yara-pm2",
      "post-deploy":
        "yarn && yarn workspace server optimize-images && NODE_ENV=production pm2 reload ecosystem.config.js --env production",
    },
    staging: {
      user: "www",
      host: "vps",
      ref: `origin/${branchName()}`,
      repo: "git@github.com:alacolang/kolbeh.git",
      path: "/home/www/yara-staging",
      "post-deploy": "yarn && NODE_ENV=staging pm2 reload ecosystem.config.js --env staging",
    },
  },
};
