const branchName = require("current-git-branch");

function addEnvSuffix(name) {
  return process.env.NODE_ENV + "_" + name;
}

const env_staging = {
  PORT: 9000,
  REDIS_DATABASE_MESSAGING: 10,
  REDIS_DATABASE: 11,
  NODE_ENV: "staging",
  REDIS_HOST: "127.0.0.1",
  REDIS_PORT: 6379,
  HAPPINESS_MIN_DELAY_BEFORE_NEXT_EXERCISE_IN_HOUR: (1.0 / 60) * 10,
  HOST: "http://stg.alacolang.ir/kolbeh",
  HAPPINESS_MAX_INACTIVE_DAYS: 3,
  HAPPINESS_MESSAGING_CRON: "0 */5 * * * * *",
  HAPPINESS_MESSAGING_TTL_IN_HOUR: 1,
  STOP_MESSAGING_HOUR: 21,
  START_MESSAGING_HOUR: 9,
};

const env_production = {
  PORT: 8000,
  REDIS_DATABASE_MESSAGING: 3,
  REDIS_DATABASE: 4,
  NODE_ENV: "production",
  REDIS_HOST: "127.0.0.1",
  REDIS_PORT: 6379,
  HAPPINESS_MIN_DELAY_BEFORE_NEXT_EXERCISE_IN_HOUR: 24,
  HOST: "http://alacolang.ir/kolbeh",
  HAPPINESS_MAX_INACTIVE_DAYS: 3,
  HAPPINESS_MESSAGING_CRON: "0 18 * * * *",
  HAPPINESS_MESSAGING_TTL_IN_HOUR: 8,
  STOP_MESSAGING_HOUR: 21,
  START_MESSAGING_HOUR: 9,
};

const app = {
  name: addEnvSuffix("API"),
  script: "yarn start",
  // args: 'one',
  cwd: "./packages/server",
  instances: 1,
  autorestart: true,
  watch: false,
  env_production,
  env_staging,
};

module.exports = {
  apps: [
    app,
    {
      ...app,
      name: addEnvSuffix("MESSAGING_PRODUCER"),
      script: "yarn start:messaging-producer",
    },
    {
      name: addEnvSuffix("MESSAGING_WORKER"),
      ...app,
      script: "yarn start:messaging-worker",
    },
    // {
    //   name: addEnvSuffix("IMAGE"),
    //   script: "yarn start",
    //   cwd: "./packages/image",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   //interpreter: "babel-node",
    //   env_staging: {
    //     PORT: 9010,
    //     HOST: "https://stg.alacolang.ir/kolbeh",
    //     NODE_ENV: "staging",
    //   },
    //   env_production: {
    //     PORT: 8010,
    //     HOST: "https://alacolang.ir/kolbeh",
    //     NODE_ENV: "production",
    //   },
    // },
  ],

  deploy: {
    production: {
      user: "www",
      host: "vps",
      ref: "origin/master",
      repo: "git@github.com:alacolang/kolbeh.git",
      path: "/home/www/yara-pm2",
      "post-deploy":
        " && NODE_ENV=production pm2 startOrRestart ecosystem.config.js --env production",
    },
    staging: {
      user: "www",
      host: "vps",
      ref: `origin/${branchName()}`,
      repo: "git@github.com:alacolang/kolbeh.git",
      path: "/home/www/yara-staging",
      "post-deploy":
        "yarn && NODE_ENV=staging pm2 startOrRestart ecosystem.config.js --env staging",
    },
  },
};
