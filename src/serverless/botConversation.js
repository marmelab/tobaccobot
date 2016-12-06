import sg from 'sg.js';

import botConversationSaga from './botConversation/saga';

export default function botConversation(event, ctx, cb) {
    try {
        sg(botConversationSaga)(event.body || event)
        .catch((error) => {
            console.error({ error });
        });
    } catch (error) {
        console.error({ error });
    }
    return cb(null, '');
}
