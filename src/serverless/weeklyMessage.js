import sg from 'sg.js';

import logger from './services/logger';
import weeklyMessageSaga from './weeklyMessage/saga';

export default function dailyMessage(event, ctx, cb) {
    logger.info('dailyMessage lambda called', { event }, ctx);
    sg(weeklyMessageSaga)()
    .then(() => cb())
    .catch((error) => {
        logger.error(error.message, error.stack);
        cb(error);
    });
}
