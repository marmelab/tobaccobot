import { call } from 'sg.js';

import getWeeklySmoker from './getWeeklySmoker';
import sendNewtargetMessage from './sendNewTargetMessage';
import getWeeklyMessageData from './getWeeklyMessageData';
import updateUser from './updateUser';

export default function* newTarget(items) {
    const smokers = yield call(getWeeklySmoker, items);
    if (smokers && smokers.length) {
        const messagesData = yield call(getWeeklyMessageData, smokers);
        yield call(sendNewtargetMessage, messagesData);
    }
    yield smokers.map(user => call(updateUser, user));
}
