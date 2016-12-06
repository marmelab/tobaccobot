import winston from 'winston';

const transports = [
    new (winston.transports.Console)({
        timestamp: true,
    }),
];

export default new (winston.Logger)({
    transports,
});
