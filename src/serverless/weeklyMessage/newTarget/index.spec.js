import expect from 'expect';
import { call } from 'sg.js';

import newTargetSaga from './index';
import getWeeklySmoker from './getWeeklySmoker';
import getWeeklyMessageData from './getWeeklyMessageData';
import sendNewTargetMessage from './sendNewTargetMessage';
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

    it('should call getWeeklyMessageData with smokers', () => {
        const { value } = iterator.next(['weeklySmokers']);
        expect(value).toEqual(call(getWeeklyMessageData, ['weeklySmokers']));
    });

    it('should call sendNewTargetMessage with messagesData', () => {
        const { value } = iterator.next('messagesData');
        expect(value).toEqual(call(sendNewTargetMessage, 'messagesData'));
    });

    it('should call updateUser with all smoker', () => {
        const { value } = iterator.next(['smokers']);
        expect(value).toEqual([call(updateUser, 'weeklySmokers')]);
    });
});
