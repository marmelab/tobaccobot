import sg, { call } from 'sg/sg';
import createUser from './effects/createUser';
import getUser from './effects/getUser';
import qualifyUser from './effects/qualifyUser';
import updateUser from './effects/updateUser';
import sendDubiousMessage from './effects/sendDubiousMessage';
import sendQualifiedMessage from './effects/sendQualifiedMessage';
import sendWelcomeMessage from './effects/sendWelcomeMessage';
import computeRemainingDays from './effects/computeRemainingDays';
import computeTargetConsumption from './effects/computeTargetConsumption';

const SUBSCRIBE = 'SUBSCRIBE';
const NEW_MESSAGE = 'NEW_MESSAGE';

export const subscribe = smokerData => ({
    type: SUBSCRIBE,
    payload: smokerData,
});

export const newMessage = message => ({
    type: NEW_MESSAGE,
    payload: message,
});

export function* saga({ type, payload }) {
    switch (type) {
    case SUBSCRIBE: {
        const user = yield call(createUser, payload);
        yield call(sendWelcomeMessage, user);
        yield call(updateUser, { ...user, state: 'welcomed' });
        return user;
    }
    case NEW_MESSAGE: {
        const user = yield call(getUser, payload.user);

        if (user && user.state === 'welcomed') {
            const { state, nbCigarettes } = yield call(qualifyUser, user, payload);

            switch (state) {
            case 'dubious': {
                yield call(updateUser, { ...user, state });
                yield call(sendDubiousMessage, user);
                break;
            }
            case 'qualified': {
                const targetConsumption = yield call(computeTargetConsumption, nbCigarettes);
                const remainingDays = yield call(computeRemainingDays, user, nbCigarettes);
                yield call(updateUser, { ...user, state, targetConsumption, remainingDays });
                yield call(sendQualifiedMessage, targetConsumption);
                break;
            }
            default:
                throw new Error('Invalid user state');
            }
        }

        return null;
    }
    default:
        throw new Error('Invalid type');
    }
}

export default sg(saga);
