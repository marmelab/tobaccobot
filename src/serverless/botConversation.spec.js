import expect from 'expect';
import { call } from 'sg.js';

import dynamoDB from './services/dynamoDB';
import botConversation, { botConversationSaga } from './botConversation';
import { setupSmokerTable } from './setupSmokerTable';

import getUser from './effects/getUser';
import handleWelcomedUser from './effects/handleWelcomedUser';

describe('botConversation', () => {
    describe('botConversation lambda', () => {
        before(function* () {
            yield setupSmokerTable();
        });

        it('should return 200 with valid number of cigarettes', (done) => {
            botConversation({ message: '42', number: '+33614786356' }, null, (error, result) => {
                expect(result).toBe('');
                done(error);
            });
        });

        it('should return 200 with invalid number of cigarettes', (done) => {
            botConversation({ message: 'foo', number: '+33614786356' }, null, (error, result) => {
                expect(result).toBe('');
                done(error);
            });
        });

        after(function* () {
            yield dynamoDB.deleteTable({
                TableName: 'smoker',
            });
        });
    });

    describe('botConversation saga', () => {
        describe('welcomed user', () => {
            const message = { number: '+33614786356', text: '42' };
            const saga = botConversationSaga(message);
            const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };

            it('should get the user', () => {
                expect(saga.next().value).toEqual(call(getUser, message.number));
            });

            it('should call handleWelcomedUser with message and user', () => {
                expect(saga.next(user).value).toEqual(call(handleWelcomedUser, message, user));
            });
        });

        describe('other user', () => {
            const message = { number: '+33614786356', text: '42' };
            const saga = botConversationSaga(message);
            const user = { name: 'johnny', phone: 'foo', state: 'other' };

            it('should get the user', () => {
                expect(saga.next().value).toEqual(call(getUser, message.number));
            });

            it('should end', () => {
                expect(saga.next(user).done).toBe(true);
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
    });
});
