import { call } from 'sg.js';

import qualifyUser from './qualifyUser';
import sendQualifiedMessage from './sendQualifiedMessage';
import updateUser from './updateUser';
import sendDubiousMessage from './sendDubiousMessage';
import computeTargetConsumption from './computeTargetConsumption';

export default function* handleWelcomedUser(message, user) {
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
