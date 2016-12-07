import { call } from 'sg.js';
import { batchSize } from 'config';

import smoker from '../services/smoker';
import newTarget from './newTarget';
import end from './end';

export default function* weeklyMessageSaga(lastIndex) {
    const { lastKey, items } = yield call(smoker.all, batchSize, lastIndex);
    if (!items || !items.length) {
        return;
    }

    yield [
        call(newTarget, items),
        call(end, items),
    ];

    if (!lastKey) {
        return;
    }

    yield* weeklyMessageSaga(lastKey); // yield* execute a generator in the context of the current one
}
