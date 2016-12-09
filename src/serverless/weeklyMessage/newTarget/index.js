import { call } from 'sg.js';

import getWeeklySmoker from './getWeeklySmoker';
import sendNewtargetMessage from './sendNewTargetMessage';
import getWeeklyMessageData from './getWeeklyMessageData';
import updateUser from './updateUser';

export default function* newTarget(items) {
    const smokers = yield call(getWeeklySmoker, items);
    const updatedUsers = yield smokers.map(user => call(updateUser, user));
    if (smokers && smokers.length) {
        const messagesData = yield call(getWeeklyMessageData, updatedUsers);
        yield call(sendNewtargetMessage, messagesData);
    }
}
