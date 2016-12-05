import sg from 'sg.js';

import logger from './services/logger';
import dailyMessageSaga from './dailyMessage/saga';

export default function dailyMessage(event, ctx, cb) {
    logger.info('dailyMessage lambda called', { event }, ctx);
    sg(dailyMessageSaga)()
    .then(() => cb())
    .catch((error) => {
        logger.error(error.message, error.stack);
        cb(error);
    });
}
