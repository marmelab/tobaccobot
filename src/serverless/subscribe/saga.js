import { call } from 'sg.js';

import createUser from './createUser';
import sendWelcomeMessage from './sendWelcomeMessage';
import smoker from '../services/smoker';

export default function* subscribeSaga(smokerData) {
    let user = yield call(createUser, smokerData);
    yield call(sendWelcomeMessage, user.phone, user.name);
    user = yield call(smoker.save, { ...user, state: 'welcomed' });
    return user;
}
