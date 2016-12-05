import { call } from 'sg.js';

import smoker from '../../services/smoker';
import getWeeklySmoker from './getWeeklySmoker';
import sendWeeklyMessage from './sendWeeklyMessage';
import getWeeklyMessageData from './getWeeklyMessageData';
import updateUser from './updateUser';

export default function* newTarget(items) {
    const smokers = yield call(getWeeklySmoker, items);
    const updatedUsers = yield smokers.map(user => call(smoker.save, user));
    if (smokers && smokers.length) {
        const messagesData = yield call(getWeeklyMessageData, updatedUsers);
        yield call(sendWeeklyMessage, messagesData);
    }

    yield updatedUsers.map(user => call(updateUser, user));
}
