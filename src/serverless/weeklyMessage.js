import sg, { call } from 'sg.js';

import { batchSize } from '../../config';
import smoker from './services/smoker';
import getWeeklySmoker from './effects/getWeeklySmoker';
import computeTargetConsumption from './effects/computeTargetConsumption';

export const getWeeklyMessageData = (user) => {
    const remainingWeeks = user.remainingDays / 7;
    const oldTarget = user.targetConsumption;
    const newTarget = computeTargetConsumption(oldTarget, remainingWeeks);
    return {
        phone: user.phone,
        remainingWeeks,
        oldTarget,
        newTarget,
    };
};

export const udateUser = user => ({
    ...user,
    targetConsumption: computeTargetConsumption(user.targetConsumption, user.remainingDays / 7),
});

export function* weeklyMessageSaga(lastIndex) {
    const { lastKey, items } = yield call(smoker.all, batchSize, lastIndex);
    if (!items || !items.length) {
        return;
    }
    const smokers = yield call(getWeeklySmoker, items);
    if (smokers && smokers.length) {
        const messagesData = yield smokers.map(user => call(getWeeklyMessageData, user));
    }

    if (!lastKey) {
        return;
    }

    yield* weeklyMessageSaga(lastKey); // yield* execute a generator in the context of the current one
}

export default function dailyMessage(event, ctx, cb) {
    sg(weeklyMessageSaga)()
    .then(() => cb())
    .catch(cb);
}
