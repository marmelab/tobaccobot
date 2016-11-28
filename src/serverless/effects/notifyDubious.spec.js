import expect from 'expect';
import { call } from 'sg.js';

import notifyDubious, { getMessages, setStateToWelcomed } from './notifyDubious';
import sendSms from '../services/sendSms';
import smoker from '../services/smoker';

describe('notifyDubious', () => {
    let iterator;
    before(() => {
        iterator = notifyDubious(['users']);
    });

    it('should call getMessages with users', () => {
        const { value } = iterator.next();

        expect(value).toEqual(call(getMessages, ['users']));
    });

    it('should call sendSMS with received phones and message', () => {
        const { value } = iterator.next({ message: 'message', phones: 'phones' });
        expect(value).toEqual(call(sendSms, 'phones', 'message'));
    });

    it('should call setStateToWelcomed with users', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(setStateToWelcomed, ['users']));
    });

    it('should call smoker.save for each received updated users', () => {
        const { value } = iterator.next(['user1', 'user2']);
        expect(value).toEqual([
            call(smoker.save, 'user1'),
            call(smoker.save, 'user2'),
        ]);
    });
});
