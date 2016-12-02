import expect from 'expect';
import { call } from 'sg.js';
import config from 'config';

import weeklyMessageSaga from './saga';
import smoker from '../services/smoker';
import getWeeklySmoker from './getWeeklySmoker';
import getWeeklyMessageData from './getWeeklyMessageData';
import sendWeeklyMessage from './sendWeeklyMessage';
import updateUser from './updateUser';

describe('weeklyMessageSaga', () => {
    let iterator;

    before(() => {
        iterator = weeklyMessageSaga();
    });

    it('should call smoker.all with config.batchSize', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(smoker.all, config.batchSize, undefined));
    });

    it('should call getWeeklySmoker with user returned by smoker.all', () => {
        const { value } = iterator.next({ items: 'users', lastKey: 'lastKey' });
        expect(value).toEqual(call(getWeeklySmoker, 'users'));
    });

    it('should call getWeeklyMessageData with smokers', () => {
        const { value } = iterator.next(['smokers']);
        expect(value).toEqual(call(getWeeklyMessageData, ['smokers']));
    });

    it('should call sendWeeklyMessage with messagesData', () => {
        const { value } = iterator.next('messagesData');
        expect(value).toEqual(call(sendWeeklyMessage, 'messagesData'));
    });

    it('should call updateUser with all smoker', () => {
        const { value } = iterator.next();
        expect(value).toEqual([call(updateUser, 'smokers')]);
    });

    it('should call smoker.save with all updatedSmoker', () => {
        const { value } = iterator.next(['updatedSmoker']);
        expect(value).toEqual([call(smoker.save, 'updatedSmoker')]);
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
