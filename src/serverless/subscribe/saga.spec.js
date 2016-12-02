import expect from 'expect';
import { call } from 'sg.js';

import subscribeSaga from './saga';

import createUser from './createUser';
import sendWelcomeMessage from './sendWelcomeMessage';
import updateUser from '../effects/updateUser';

describe('subscribe saga', () => {
    const smokerData = { name: 'johnny', phone: '+33614786356' };
    const saga = subscribeSaga(smokerData);

    it('should create the user', () => {
        expect(saga.next().value).toEqual(call(createUser, smokerData));
    });

    it('should send the welcome message', () => {
        expect(saga.next(smokerData).value).toEqual(call(sendWelcomeMessage, smokerData.phone, smokerData.name));
    });

    it('should update the user state', () => {
        expect(saga.next(smokerData).value).toEqual(call(updateUser, { ...smokerData, state: 'welcomed' }));
    });
});
