import { call } from 'sg.js';

import getDailySmokers from './getDailySmokers';
import sortSmokersByState from './sortSmokersByState';
import notifyDubious from './notifyDubious';
import notifyQualified from './notifyQualified';

export default function* dailyMessageSaga(smokers) {
    const dailySmokers = yield call(getDailySmokers, smokers);
    const { asked = [], dubious = [], qualified = [] } = yield call(sortSmokersByState, dailySmokers);

    yield call(notifyDubious, dubious);

    // Users with asked state haven't answered the previous day, we send them a message for the current day anyway
    yield call(notifyQualified, [...asked, ...qualified]);
}
