import sg, { call } from 'sg.js';
import { batchSize } from 'config';

import smoker from './services/smoker';
import getWeeklySmoker from './effects/getWeeklySmoker';
import sendWeeklyMessage from './effects/sendWeeklyMessage';
import weeklyMessageSaga from './weeklyMessage/saga';

export default function dailyMessage(event, ctx, cb) {
    sg(weeklyMessageSaga)()
    .then(() => cb())
    .catch(cb);
}
