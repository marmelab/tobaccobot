import expect from 'expect';
import { call } from 'sg.js';

import dailyMessageSaga from './saga';
import getDailySmokers from './getDailySmokers';
import sortSmokersByState from './sortSmokersByState';
import notifyDubious from './notifyDubious';
import notifyQualified from './notifyQualified';

describe('dailyMessageSaga', () => {
    let iterator;

    before(() => {
        iterator = dailyMessageSaga('users');
    });

    it('should call getDailySmokers with users passed to the saga', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(getDailySmokers, 'users'));
    });

    it('should call sortSmokersByState with users returned by getDailySmokers', () => {
        const { value } = iterator.next('dailySmokers');
        expect(value).toEqual(call(sortSmokersByState, 'dailySmokers'));
    });

    it('should call notifyQualified with qualified and asked key then notifyDubious with dubious key', () => {
        let { value } = iterator.next({ asked: ['asked'], qualified: ['qualified'], dubious: 'dubious' });
        expect(value).toEqual(call(notifyDubious, 'dubious'));
        value = iterator.next().value;
        expect(value).toEqual(call(notifyQualified, ['asked', 'qualified']));
    });
});
