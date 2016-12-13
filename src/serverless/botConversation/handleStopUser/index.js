import { call } from 'sg.js';
import omit from 'lodash.omit';
import uuid from 'uuid';

import sendStopMessage from './sendStopMessage';
import archive from '../../services/archive';
import smoker from '../../services/smoker';

export default function* handleStopUser(user) {
    yield call(archive.save, {
        ...omit(user, 'phone'),
        id: uuid.v4(),
        state: 'stopped',
    });

    yield call(smoker.delete, user.phone);

    yield call(sendStopMessage, user.phone);
}
