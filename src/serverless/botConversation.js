import sg from 'sg.js';
import logger from './services/logger';

import botConversationSaga from './botConversation/saga';

export function botConversation(body) {
    if (body && body.status === 'DELIVERED') { // Acknowledgement, ignoring
        return Promise.resolve();
    }

    return sg(botConversationSaga)(body);
}

export default function (event, ctx, cb) {
    logger.info('botConversation called', { event }, ctx);

    try {
        botConversation(event.body || event)
        .catch(error => logger.error(error));
    } catch (error) {
        logger.error(error.message, error.stack);
    }
    return cb(null, '');
}
