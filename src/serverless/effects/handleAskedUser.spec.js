import expect from 'expect';
import { call } from 'sg.js';

import handleAskedUser, { updateUser } from './handleAskedUser';
import getNbCigarettes from './getNbCigarettes';
import evaluateHistory from './evaluateHistory';
import sendDailyEvaluationMessage from './sendDailyEvaluationMessage';
import smoker from '../services/smoker';

describe('handleAskedUser', () => {
    let iterator;
    const message = {
        text: 'text',
    };
    const user = {
        name: 'john',
        phone: 'phone',
    };
    before(() => {
        iterator = handleAskedUser(message, user);
    });

    it('should call getNbCigarettes with message.text', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(getNbCigarettes, message.text));
    });

    it('should call updateUser with user and nbCigarettes returned by getNbCigarettes', () => {
        const { value } = iterator.next(42);
        expect(value).toEqual(call(updateUser, user, 42));
    });

    it('should call evaluateHistory with updatedUser', () => {
        const { value } = iterator.next({
            history: 'history',
            targetConsumption: 'targetConsumption',
            phone: 'updatedUserPhone',
        });
        expect(value).toEqual(call(evaluateHistory, 'history', 'targetConsumption'));
    });

    it('should call sendDailyEvaluationMessage with updatedUserPhone and returned evaluation', () => {
        const evaluation = { evaluation: 'data', state: 'state' };
        const { value } = iterator.next(evaluation);
        expect(value).toEqual(call(sendDailyEvaluationMessage, 'updatedUserPhone', evaluation));
    });

    it('should call smoker.save with { ...updatedUser, state: evaluation.state }', () => {
        const { value } = iterator.next();
        expect(value).toEqual(call(smoker.save, {
            history: 'history',
            targetConsumption: 'targetConsumption',
            phone: 'updatedUserPhone',
            state: 'state',
        }));
    });

    it('should end if no number returned by getNbCigarettes', () => {
        const it = handleAskedUser(message, user);
        const { value } = it.next();
        expect(value).toEqual(call(getNbCigarettes, message.text));
        const { done } = it.next();
        expect(done).toBe(true);
    });
});
