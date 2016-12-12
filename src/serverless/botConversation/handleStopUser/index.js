import { call } from 'sg.js';

import sendStopMessage from './sendStopMessage';
import archive from '../../services/archive';
import smoker from '../../services/smoker';

export default function* handleStopUser(user) {
    yield call(archive.archive, {
        ...user,
        state: 'stopped',
    });

    yield call(smoker.delete, user.phone);

    yield call(sendStopMessage, user.phone);
}
