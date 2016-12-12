import expect from 'expect';
import { call } from 'sg.js';
import omit from 'lodash.omit';

import handleStopUser from './index';
import archive from '../../services/archive';
import smoker from '../../services/smoker';
import sendStopMessage from './sendStopMessage';

describe('handleStopUser', () => {
    const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };
    const saga = handleStopUser(user);

    it('should archive the user', () => {
        const { value } = saga.next();
        const expectedValue = call(archive.save, {
            name: 'johnny',
            state: 'stopped',
        });

        expect(value.callable).toEqual(expectedValue.callable);
        expect(omit(value.args[0], 'id')).toEqual(expectedValue.args[0]);
        expect(value.args[0].id).toExist();
    });

    it('should delete the user from the smoker table', () => {
        expect(saga.next().value).toEqual(call(smoker.delete, 'foo'));
    });

    it('should send the stop message', () => {
        expect(saga.next().value).toEqual(call(sendStopMessage, user.phone));
    });
});
