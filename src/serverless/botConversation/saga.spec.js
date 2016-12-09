import expect from 'expect';
import { call } from 'sg.js';

import botConversationSaga from './saga';
import getUser from './getUser';
import handleWelcomedUser from './handleWelcomedUser';
import handleAskedUser from './handleAskedUser';
import handleStopUser from './handleStopUser';
import getNbCigarettes from './getNbCigarettes';

describe('botConversation saga', () => {
    describe('welcomed user', () => {
        const message = { number: '+33614786356', text: '42' };
        const saga = botConversationSaga(message);
        const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };

        it('should get the user', () => {
            expect(saga.next().value).toEqual(call(getUser, message.number));
        });

        it('should get nbCigarettes', () => {
            expect(saga.next(user).value).toEqual(call(getNbCigarettes, message.text));
        });

        it('should call handleWelcomedUser with nbCigarettes and user', () => {
            expect(saga.next(42).value).toEqual(call(handleWelcomedUser, 42, user));
        });
    });

    describe('asked user', () => {
        const message = { number: '+33614786356', text: '42' };
        const saga = botConversationSaga(message);
        const user = { name: 'johnny', phone: 'foo', state: 'asked' };

        it('should get the user', () => {
            expect(saga.next().value).toEqual(call(getUser, message.number));
        });

        it('should get nbCigarettes', () => {
            expect(saga.next(user).value).toEqual(call(getNbCigarettes, message.text));
        });

        it('should call handleAskedUser with nbCigarettes and user', () => {
            expect(saga.next(42).value).toEqual(call(handleAskedUser, 42, user));
        });
    });

    describe('other user', () => {
        const message = { number: '+33614786356', text: '42' };
        const saga = botConversationSaga(message);
        const user = { name: 'johnny', phone: 'foo', state: 'other' };

        it('should get the user', () => {
            expect(saga.next().value).toEqual(call(getUser, message.number));
        });

        it('should get nbCigarettes', () => {
            expect(saga.next(user).value).toEqual(call(getNbCigarettes, message.text));
        });

        it('should end', () => {
            expect(saga.next().done).toBe(true);
        });
    });

    describe('no user', () => {
        const message = { number: '+33614786356', text: '42' };
        const saga = botConversationSaga(message);

        it('should get the user', () => {
            expect(saga.next().value).toEqual(call(getUser, message.number));
        });

        it('should end', () => {
            expect(saga.next().done).toBe(true);
        });
    });

    describe('stop user', () => {
        const message = { number: '+33614786356', text: 'STOP', stop_date: 'today' };
        const saga = botConversationSaga(message);
        const user = { name: 'johnny', phone: 'foo', state: 'other' };

        it('should get the user', () => {
            expect(saga.next().value).toEqual(call(getUser, message.number));
        });

        it('should call handleStopUser with user', () => {
            expect(saga.next(user).value).toEqual(call(handleStopUser, user));
        });

        it('should end', () => {
            expect(saga.next().done).toBe(true);
        });
    });
});
