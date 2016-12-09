import expect from 'expect';
import { call } from 'sg.js';

import handleStopUser from './index';

import smoker from '../../services/smoker';
import sendStopMessage from './sendStopMessage';

describe('handleStopUser', () => {
    const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };
    const saga = handleStopUser(user);

    it('should update the user', () => {
        expect(saga.next().value).toEqual(call(smoker.save, {
            ...user,
            state: 'stopped',
        }));
    });

    it('should send the stop message', () => {
        expect(saga.next().value).toEqual(call(sendStopMessage, user.phone));
    });
});
