import { call } from 'sg.js';

import getWeeklySmokers from './getWeeklySmokers';
import sendNewtargetMessage from './sendNewTargetMessage';
import getWeeklyMessageData from './getWeeklyMessageData';
import updateUser from './updateUser';

export default function* newTarget(items) {
    const smokers = yield call(getWeeklySmokers, items);
    if (smokers && smokers.length) {
        const messagesData = yield call(getWeeklyMessageData, smokers);
        yield call(sendNewtargetMessage, messagesData);
    }
    yield smokers.map(user => call(updateUser, user));
}
