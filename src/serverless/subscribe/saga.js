import { call } from 'sg.js';

import createUser from './createUser';
import sendWelcomeMessage from './sendWelcomeMessage';
import updateUser from '../effects/updateUser';

export default function* subscribeSaga(smokerData) {
    let smoker = yield call(createUser, smokerData);
    yield call(sendWelcomeMessage, smoker.phone, smoker.name);
    smoker = yield call(updateUser, { ...smoker, state: 'welcomed' });
    return smoker;
}
