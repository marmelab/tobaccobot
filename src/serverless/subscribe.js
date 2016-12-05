import sg from 'sg.js';

import logger from './services/logger';
import generatorToCPS from './utils/generatorToCPS';
import subscribeSaga from './subscribe/saga';

export function* subscribe(event, ctx) {
    logger.info('subscribe lambda called', { event }, ctx);
    try {
        const user = yield sg(subscribeSaga)(event.body);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: user,
        };
    } catch (error) {
        logger.error(error.message, error.stack);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: error.message,
        };
    }
}

export default generatorToCPS(subscribe);
