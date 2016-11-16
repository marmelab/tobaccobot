import config from 'config';

before(() => {
    global.config = config;
    global.dynamoDB = require('../src/serverless/services/dynamoDB');
});

after(() => {
    delete global.config;
});
