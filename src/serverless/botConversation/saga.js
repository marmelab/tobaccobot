import { call } from 'sg.js';

import getUser from './getUser';
import getNbCigarettes from './getNbCigarettes';
import handleWelcomedUser from './handleWelcomedUser';
import handleAskedUser from './handleAskedUser';

export default function* botConversationSaga(message) {
    const user = yield call(getUser, message.number);
    if (!user) {
        return;
    }

    const nbCigarettes = yield call(getNbCigarettes, message.text);

    switch (user.state) {
    case 'welcomed': {
        yield call(handleWelcomedUser, nbCigarettes, user);
        return;
    }
    case 'asked': {
        yield call(handleAskedUser, nbCigarettes, user);
        return;
    }
    default:
        return;
    }
}
