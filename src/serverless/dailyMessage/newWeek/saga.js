import { call } from 'sg.js';

import newTarget from './newTarget';
import end from './end';

export default function* weeklyMessageSaga(smoker) {
    if (!smoker || !smoker.length) {
        return;
    }

    yield [
        call(newTarget, smoker),
        call(end, smoker),
    ];
}
