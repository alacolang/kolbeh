module.exports = {
  apps : [{
    name: 'API',
    script: 'packages/server/scripts/run.js',
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    // max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'www',
      host : 'vps',
      ref  : 'origin/master',
      repo : 'git@github.com:yassermzh/yara.git',
      path : '/home/www/yara-pm2',
      'post-deploy' : 'yarn && pm2 reload ecosystem.config.js --env production'
    }
  }
};
