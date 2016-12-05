import sg from 'sg.js';
import logger from './services/logger';

import botConversationSaga from './botConversation/saga';

export default function botConversation(event, ctx, cb) {
    logger.info('botConversation called', { event }, ctx);
    try {
        sg(botConversationSaga)(event.body || event)
        .catch((error) => {
            logger.error(error.message, error.stack);
        });
    } catch (error) {
        logger.error(error.message, error.stack);
    }
    return cb(null, '');
}
