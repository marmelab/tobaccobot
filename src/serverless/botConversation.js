import sg, { call } from 'sg.js';

import getUser from './effects/getUser';
import handleWelcomedUser from './effects/handleWelcomedUser';
import handleAskedUser from './effects/handleAskedUser';

export function* botConversationSaga(message) {
    const user = yield call(getUser, message.number);
    if (!user) {
        return;
    }

    switch (user.state) {
    case 'welcomed': {
        yield call(handleWelcomedUser, message, user);
        return;
    }
    case 'asked': {
        yield call(handleAskedUser, message, user);
        return;
    }
    default:
        return;
    }
}

export default function botConversation(event, ctx, cb) {
    try {
        sg(botConversationSaga)(event)
        .catch((error) => {
            console.error({ error });
        });
    } catch (error) {
        console.error({ error });
    }
    return cb(null, '');
}
