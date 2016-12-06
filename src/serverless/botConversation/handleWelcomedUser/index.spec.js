import expect from 'expect';
import { call } from 'sg.js';

import handleWelcomedUser from './index';

import smoker from '../../services/smoker';
import sendDubiousMessage from './sendDubiousMessage';
import sendQualifiedMessage from './sendQualifiedMessage';
import computeTargetConsumption from './computeTargetConsumption';

describe('handleWelcomedUser', () => {
    describe('qualified user', () => {
        const nbCigarettes = 42;
        const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };
        const saga = handleWelcomedUser(nbCigarettes, user);

        it('should get the next targeted number of cigarettes', () => {
            expect(saga.next().value).toEqual(call(computeTargetConsumption, nbCigarettes));
        });

        it('should update the user', () => {
            expect(saga.next({ 1: 15 }).value).toEqual(call(smoker.save, {
                ...user,
                remainingDays: 28,
                state: 'qualified',
                targetConsumption: 15,
                week: 1,
            }));
        });

        it('should send the qualified message', () => {
            expect(saga.next().value).toEqual(call(sendQualifiedMessage, 'foo', 15));
        });
    });
    describe('dubious user', () => {
        const user = { name: 'johnny', phone: 'foo', state: 'welcomed' };
        const saga = handleWelcomedUser(null, user);

        it('should update the user', () => {
            expect(saga.next(null).value).toEqual(call(smoker.save, {
                ...user,
                state: 'dubious',
            }));
        });

        it('should send the dubious message', () => {
            expect(saga.next().value).toEqual(call(sendDubiousMessage, user.phone));
        });
    });
});
