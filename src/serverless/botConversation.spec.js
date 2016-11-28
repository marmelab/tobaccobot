import expect from 'expect';
import { call } from 'sg.js';

import dynamoDB from './services/dynamoDB';
import botConversation, { botConversationSaga } from './botConversation';
import { setupSmokerTable } from './setupSmokerTable';

import getUser from './effects/getUser';
import qualifyUser from './effects/qualifyUser';
import updateUser from './effects/updateUser';
import sendDubiousMessage from './effects/sendDubiousMessage';
import sendQualifiedMessage from './effects/sendQualifiedMessage';
import computeTargetConsumption from './effects/computeTargetConsumption';

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
        describe('qualified user', () => {
            const message = { number: '+33614786356', text: '42' };
            const saga = botConversationSaga(message);
            const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };

            it('should get the user', () => {
                expect(saga.next().value).toEqual(call(getUser, message.number));
            });

            it('should qualify the user', () => {
                expect(saga.next(user).value).toEqual(call(qualifyUser, message.text));
            });

            it('should get the next targeted number of cigarettes', () => {
                expect(saga.next({ state: 'qualified', nbCigarettes: 20 }).value).toEqual(call(computeTargetConsumption, 20));
            });

            it('should update the user', () => {
                expect(saga.next(15).value).toEqual(call(updateUser, {
                    ...user,
                    remainingDays: 28,
                    state: 'qualified',
                    targetConsumption: 15,
                }));
            });

            it('should send the qualified message', () => {
                expect(saga.next().value).toEqual(call(sendQualifiedMessage, 'foo', 15));
            });
        });
        describe('dubious user', () => {
            const message = { number: '+33614786356', text: 'foo' };
            const saga = botConversationSaga(message);
            const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };

            it('should get the user', () => {
                expect(saga.next().value).toEqual(call(getUser, message.number));
            });

            it('should qualify the user', () => {
                expect(saga.next(user).value).toEqual(call(qualifyUser, message.text));
            });

            it('should update the user', () => {
                expect(saga.next({ state: 'dubious' }).value).toEqual(call(updateUser, {
                    ...user,
                    state: 'dubious',
                }));
            });

            it('should send the dubious message', () => {
                expect(saga.next().value).toEqual(call(sendDubiousMessage, user.phone));
            });
        });
    });
});
