import sg from 'sg.js';

import dailyMessageSaga from './dailyMessage/saga';

export default function dailyMessage(event, ctx, cb) {
    sg(dailyMessageSaga)()
    .then(() => cb())
    .catch(cb);
}
