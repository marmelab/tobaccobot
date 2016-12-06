import { call } from 'sg.js';
import { batchSize } from 'config';

import smoker from '../services/smoker';
import getWeeklySmoker from './getWeeklySmoker';
import sendWeeklyMessage from './sendWeeklyMessage';
import getWeeklyMessageData from './getWeeklyMessageData';

export default function* weeklyMessageSaga(lastIndex) {
    const { lastKey, items } = yield call(smoker.all, batchSize, lastIndex);
    if (!items || !items.length) {
        return;
    }
    const smokers = yield call(getWeeklySmoker, items);
    const updatedUsers = yield smokers.map(user => call(smoker.save, user));
    if (smokers && smokers.length) {
        const messagesData = yield call(getWeeklyMessageData, updatedUsers);
        yield call(sendWeeklyMessage, messagesData);
    }

    yield updatedUsers.map(user => call(smoker.save, user));

    if (!lastKey) {
        return;
    }

    yield* weeklyMessageSaga(lastKey); // yield* execute a generator in the context of the current one
}
