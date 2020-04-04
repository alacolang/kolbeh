module.exports = {
  apps : [{
    name: 'API',
    script: 'scripts/run.js',
    // args: 'one',
    cwd: './packages/server',
    instances: 1,
    autorestart: true,
    watch: false,
    interpreter: 'babel-node',
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
      'post-deploy' : 'yarn && yarn workspace server optimize-images && pm2 reload ecosystem.config.js --env production'
    }
  }
};
