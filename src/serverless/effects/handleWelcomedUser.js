import { call } from 'sg.js';

import getNbCigarettes from './getNbCigarettes';
import sendQualifiedMessage from './sendQualifiedMessage';
import updateUser from './updateUser';
import sendDubiousMessage from './sendDubiousMessage';
import computeTargetConsumption from './computeTargetConsumption';

export default function* handleWelcomedUser(message, user) {
    const nbCigarettes = yield call(getNbCigarettes, message.text);
    if (nbCigarettes === null) {
        yield call(updateUser, { ...user, state: 'dubious' });

        yield call(sendDubiousMessage, user.phone);
        return;
    }
    const targetConsumption = yield call(computeTargetConsumption, nbCigarettes);

    yield call(updateUser, {
        ...user,
        remainingDays: 28,
        week: 1,
        state: 'qualified',
        targetConsumption,
    });

    yield call(sendQualifiedMessage, user.phone, targetConsumption);
}
