import expect from 'expect';
import { call } from 'sg.js';

import { dailyMessageSaga } from './daylyMessage';
import smoker from './services/smoker';
import config from '../../config';
import sortSmokerByState from './effects/sortSmokersByState';
import notifyDubious from './effects/notifyDubious';
import notifyQualified from './effects/notifyQualified';

describe('dailyMessageSaga', () => {
    let iterator;

    before(() => {
        iterator = dailyMessageSaga();
    });

    it('should call smoker.all with config.batchSize', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(smoker.all, config.batchSize, undefined));
    });

    it('should call sortSmokerByState with user returned by smoker.all', () => {
        const { value } = iterator.next({ items: 'users', lastKey: 'lastKey' });
        expect(value).toEqual(call(sortSmokerByState, 'users'));
    });

    it('should call notifyQualified with qualified key returned by sortSmokerByState then notifyDubious with dubious key', () => {
        let { value } = iterator.next({ qualified: 'qualified', dubious: 'dubious' });
        expect(value).toEqual(call(notifyDubious, 'dubious'));
        value = iterator.next().value;
        expect(value).toEqual(call(notifyQualified, 'qualified'));
    });

    it('should restart and call smoker.all with config.batchSize and lastKey that was returned by previous smoker.all', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(smoker.all, config.batchSize, 'lastKey'));
    });

    it('shoulod end if smoker.all returned no last Key', () => {
        const { done } = iterator.next({});
        expect(done).toBe(true);
    });
});
