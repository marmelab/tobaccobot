import sg from 'sg.js';

import weeklyMessageSaga from './weeklyMessage/saga';

export default function dailyMessage(event, ctx, cb) {
    sg(weeklyMessageSaga)()
    .then(() => cb())
    .catch(cb);
}
