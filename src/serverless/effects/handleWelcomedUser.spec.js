import expect from 'expect';
import { call } from 'sg.js';

import handleWelcomedUser from './handleWelcomedUser';

import qualifyUser from './qualifyUser';
import updateUser from './updateUser';
import sendDubiousMessage from './sendDubiousMessage';
import sendQualifiedMessage from './sendQualifiedMessage';
import computeTargetConsumption from './computeTargetConsumption';

describe('handleWelcomedUser', () => {
    describe('qualified user', () => {
        const message = { number: '+33614786356', text: '42' };
        const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };
        const saga = handleWelcomedUser(message, user);

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
        const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };
        const saga = handleWelcomedUser(message, user);

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
