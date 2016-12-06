import winston from 'winston';
import config from 'config';

const transports = [];

if (config.logs) {
    transports.push(new (winston.transports.Console)({
        timestamp: true,
    }));
}

export default new (winston.Logger)({
    transports,
});
