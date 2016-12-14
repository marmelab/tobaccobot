import sg from 'sg.js';

import logger from './services/logger';
import generatorToCPS from './utils/generatorToCPS';
import reportDataSaga from './reportData/saga';

export function* reportData(event, ctx) {
    logger.info('reportData lambda called', { event }, ctx);
    try {
        const report = yield sg(reportDataSaga)(event.body);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: report,
        };
    } catch (error) {
        logger.error(error.message, error.stack);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: {
                message: error.message,
                code: error.code,
            },
        };
    }
}

export default generatorToCPS(reportData);
