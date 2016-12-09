import { call } from 'sg.js';

import sendQualifiedMessage from './sendQualifiedMessage';
import smoker from '../../services/smoker';
import sendDubiousMessage from './sendDubiousMessage';
import computeTargetConsumption from './computeTargetConsumption';

export default function* handleWelcomedUser(nbCigarettes, user) {
    if (nbCigarettes === null) {
        yield call(smoker.save, { ...user, state: 'dubious' });

        yield call(sendDubiousMessage, user.phone);
        return;
    }
    const targetConsumption = yield call(computeTargetConsumption, nbCigarettes);

    yield call(smoker.save, {
        ...user,
        remainingDays: 28,
        week: 1,
        state: 'qualified',
        targetConsumption,
    });

    yield call(sendQualifiedMessage, user.phone, targetConsumption[1]);
}
