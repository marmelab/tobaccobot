import sg, { call } from 'sg.js';
import { batchSize } from 'config';

import smoker from './services/smoker';

import sortSmokerByState from './effects/sortSmokersByState';
import notifyDubious from './effects/notifyDubious';
import notifyQualified from './effects/notifyQualified';

export function* dailyMessageSaga(lastIndex) {
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

export default function dailyMessage(event, ctx, cb) {
    sg(dailyMessageSaga)()
    .then(() => cb())
    .catch(cb);
}
