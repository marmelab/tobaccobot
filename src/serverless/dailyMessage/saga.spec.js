import expect from 'expect';
import { call } from 'sg.js';
import config from 'config';

import dailyMessageSaga from './saga';
import smoker from '../services/smoker';
import sortSmokerByState from './sortSmokersByState';
import notifyDubious from './notifyDubious';
import notifyQualified from './notifyQualified';

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

    it('should call notifyQualified with qualified and asked key then notifyDubious with dubious key', () => {
        let { value } = iterator.next({ asked: ['asked'], qualified: ['qualified'], dubious: 'dubious' });
        expect(value).toEqual(call(notifyDubious, 'dubious'));
        value = iterator.next().value;
        expect(value).toEqual(call(notifyQualified, ['asked', 'qualified']));
    });

    it('should restart and call smoker.all with config.batchSize and lastKey that was returned by previous smoker.all', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(smoker.all, config.batchSize, 'lastKey'));
    });

    it('should end if smoker.all returned no last Key', () => {
        const { done } = iterator.next({});
        expect(done).toBe(true);
    });
});
