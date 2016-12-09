import { call } from 'sg.js';

import sendStopMessage from './sendStopMessage';
import smoker from '../../services/smoker';

export default function* handleStopUser(user) {
    yield call(smoker.save, {
        ...user,
        state: 'stopped',
    });

    yield call(sendStopMessage, user.phone);
}
