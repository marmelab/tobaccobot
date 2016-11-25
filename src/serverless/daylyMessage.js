import smoker from 'smoker';
import sg, { call } from 'sg';
import { batchSize } from 'config';

import sortSmokerByState from './effects/sortSmokersByState';

export function* dailyMessageSaga(lastIndex) {
    const { lastKey, items } = yield call(smoker.all, batchSize, lastIndex);
    if (!lastKey) {
        return;
    }

    const { dubious, qualified } = yield call(sortSmokerByState, items);

    yield* dailyMessageSaga(lastKey); // yield* execute a generator in the context of the current one
}

export default function dailyMessage(event, ctx, cb) {
    try {
        sg(dailyMessageSaga)()
        .catch((error) => {
            console.error({ error });
        });
    } catch (error) {
        console.error({ error });
    }
    return cb();
}
