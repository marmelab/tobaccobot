import { call } from 'sg.js';
import { batchSize } from 'config';

import smoker from '../services/smoker';
import newDaySaga from './newDay/saga';
import newWeekSaga from './newWeek/saga';

export default function* dailyMessageSaga(lastIndex) {
    const { lastKey, items } = yield call(smoker.all, batchSize, lastIndex);

    yield* newDaySaga(items); // yield* execute a generator in the context of the current one
    yield* newWeekSaga(items); // yield* execute a generator in the context of the current one

    if (!lastKey) {
        return;
    }

    yield* dailyMessageSaga(lastKey); // yield* execute a generator in the context of the current one
}
