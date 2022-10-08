require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'n-live-backend',
            script: 'src/index.js',
            version: '1.0.0',
            env: {
                NODE_ENV: 'production'
            }
        }
    ],
    deploy: {
        production: {
            user: 'root',
            host: ['159.65.121.101'],
            ref: 'origin/main',
            repo: 'git@github.com:nfactorial-incubator/live-backend.git',
            path: '/root/n-live-backend/',
            'post-deploy':
                'npm install && pm2 startOrRestart ecosystem.config.js --env production',
            env: {
                PORT: process.env.PORT,
                MONGO_URI: process.env.MONGO_URI,
                TOKEN_KEY: process.env.TOKEN_KEY,
                MENTOR_SECRET: process.env.TOKEN_SECRET,
                TZ: process.env.TZ
            }
        }
    }
};
