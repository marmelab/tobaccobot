import sg from 'sg.js';
import logger from './services/logger';

import botConversationSaga from './botConversation/saga';
import generatorToCPS from './utils/generatorToCPS';

export function* botConversation(event) {
    return yield sg(botConversationSaga)(event.body || event);
}

export default function (event, ctx, cb) {
    logger.info('botConversation called', { event }, ctx);
    try {
        generatorToCPS(botConversationSaga)(event);
    } catch (error) {
        logger.error(error.message, error.stack);
    }
    return cb(null, '');
}
