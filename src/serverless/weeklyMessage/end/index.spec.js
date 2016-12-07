import expect from 'expect';
import { call } from 'sg.js';

import endSaga from './index';
import smoker from '../../services/smoker';
import getEndedUsers from './getEndedUsers';
import sortUserBySuccess from './sortUserBySuccess';
import sendSuccessMessage from './sendSuccessMessage';
import sendFailureMessage from './sendFailureMessage';

describe('endSaga', () => {
    let iterator;
    const endedUsers = [
        { name: 'endedUser1', phone: 'phone1' },
        { name: 'endedUser2', phone: 'phone2' },
    ];

    before(() => {
        iterator = endSaga('users');
    });

    it('should call getEndedUsers with users', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(getEndedUsers, 'users'));
    });

    it('should call sortUserBySuccess with endedUsers', () => {
        const { value } = iterator.next(endedUsers);
        expect(value).toEqual(call(sortUserBySuccess, endedUsers));
    });

    it('should call sendSuccessMessage with success and sendFailureMessage with failure', () => {
        const { value } = iterator.next({ success: 'success', failure: 'failure' });
        expect(value).toEqual([
            call(sendSuccessMessage, 'success'),
            call(sendFailureMessage, 'failure'),
        ]);
    });

    it('should call smoker.delete for every endedUsers', () => {
        const { value } = iterator.next();
        expect(value).toEqual([
            call(smoker.delete, 'phone1'),
            call(smoker.delete, 'phone2'),
        ]);
    });
});
