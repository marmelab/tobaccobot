import expect from 'expect';
import { call } from 'sg.js';

import newTargetSaga from './index';
import smoker from '../../services/smoker';
import getWeeklySmoker from './getWeeklySmoker';
import getWeeklyMessageData from './getWeeklyMessageData';
import sendWeeklyMessage from './sendWeeklyMessage';
import updateUser from './updateUser';

describe('newTargetSaga', () => {
    let iterator;

    before(() => {
        iterator = newTargetSaga('users');
    });

    it('should call getWeeklySmoker with users', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(getWeeklySmoker, 'users'));
    });

    it('should call updateUser with all smoker', () => {
        const { value } = iterator.next(['smokers']);
        expect(value).toEqual([call(smoker.save, 'smokers')]);
    });

    it('should call getWeeklyMessageData with smokers', () => {
        const { value } = iterator.next(['updatedSmokers']);
        expect(value).toEqual(call(getWeeklyMessageData, ['updatedSmokers']));
    });


    it('should call sendWeeklyMessage with messagesData', () => {
        const { value } = iterator.next('messagesData');
        expect(value).toEqual(call(sendWeeklyMessage, 'messagesData'));
    });

    it('should call smoker.save with all updatedSmoker', () => {
        const { value } = iterator.next();
        expect(value).toEqual([call(updateUser, 'updatedSmokers')]);
    });
});
