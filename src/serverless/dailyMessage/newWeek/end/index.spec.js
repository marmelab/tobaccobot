import expect from 'expect';
import { call } from 'sg.js';

import endSaga from './';
import archiveUser from './archiveUser';
import getEndedUsers from './getEndedUsers';
import sortUserBySuccess from './sortUserBySuccess';
import sendSuccessMessage from './sendSuccessMessage';
import sendFailureMessage from './sendFailureMessage';

describe('endSaga', () => {
    let iterator;
    const users = [
        { name: 'endedUser1', phone: 'phone1', remainingDays: 0 },
        { name: 'endedUser2', phone: 'phone2', remainingDays: 0 },
        { name: 'endedUser3', phone: 'phone3', remainingDays: 10 },
    ];

    const endedUsers = users.filter(u => u.remainingDays === 0);

    before(() => {
        iterator = endSaga(users);
    });

    it('should call getEndedUsers with users', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(getEndedUsers, users));
    });

    it('should call smoker.delete for every endedUsers', () => {
        const { value } = iterator.next(endedUsers);

        expect(value).toEqual(endedUsers.map(u => call(archiveUser, u)));
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
});
