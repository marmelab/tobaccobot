import { call } from 'sg.js';
import { batchSize } from 'config';

import smoker from '../services/smoker';
import sortSmokerByState from './sortSmokersByState';
import notifyDubious from './notifyDubious';
import notifyQualified from './notifyQualified';

export default function* dailyMessageSaga(lastIndex) {
    const { lastKey, items } = yield call(smoker.all, batchSize, lastIndex);

    if (!items || !items.length) {
        return;
    }

    const { dubious, qualified } = yield call(sortSmokerByState, items);

    yield call(notifyDubious, dubious);
    yield call(notifyQualified, qualified);

    if (!lastKey) {
        return;
    }

    yield* dailyMessageSaga(lastKey); // yield* execute a generator in the context of the current one
}
