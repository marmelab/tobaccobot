import sg, { call } from 'sg.js';

import getUser from './effects/getUser';
import qualifyUser from './effects/qualifyUser';
import updateUser from './effects/updateUser';
import sendDubiousMessage from './effects/sendDubiousMessage';
import sendQualifiedMessage from './effects/sendQualifiedMessage';
import computeTargetConsumption from './effects/computeTargetConsumption';

export function* botConversationSaga(message) {
    const user = yield call(getUser, message.number);

    if (user && user.state === 'welcomed') {
        const { state, nbCigarettes } = yield call(qualifyUser, message.text);
        switch (state) {
        case 'dubious': {
            yield call(updateUser, { ...user, state });

            yield call(sendDubiousMessage, user.phone);
            break;
        }
        case 'qualified': {
            const targetConsumption = yield call(computeTargetConsumption, nbCigarettes);

            yield call(updateUser, {
                ...user,
                remainingDays: 28,
                state,
                targetConsumption,
            });

            yield call(sendQualifiedMessage, user.phone, targetConsumption);
            break;
        }
        default:
            throw new Error('Invalid user state');
        }
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
