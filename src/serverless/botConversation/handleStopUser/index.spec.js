import expect from 'expect';
import { call } from 'sg.js';

import handleStopUser from './index';
import archive from '../../services/archive';
import smoker from '../../services/smoker';
import sendStopMessage from './sendStopMessage';

describe('handleStopUser', () => {
    const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };
    const saga = handleStopUser(user);

    it('should archive the user', () => {
        const { value } = saga.next();
        expect(value).toEqual(call(archive.archive, {
            ...user,
            state: 'stopped',
        }));
    });

    it('should delete the user from the smoker table', () => {
        expect(saga.next().value).toEqual(call(smoker.delete, 'foo'));
    });

    it('should send the stop message', () => {
        expect(saga.next().value).toEqual(call(sendStopMessage, user.phone));
    });
});
