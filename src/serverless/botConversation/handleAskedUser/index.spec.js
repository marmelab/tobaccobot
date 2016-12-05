import expect from 'expect';
import { call } from 'sg.js';

import handleAskedUser from './index';
import addConsumptionToUser from './addConsumptionToUser';
import evaluateHistory from './evaluateHistory';
import sendDailyEvaluationMessage from './sendDailyEvaluationMessage';
import smoker from '../../services/smoker';

describe('handleAskedUser', () => {
    let iterator;
    const nbCigarettes = 42;
    const user = {
        name: 'john',
        phone: 'phone',
    };
    before(() => {
        iterator = handleAskedUser(nbCigarettes, user);
    });

    it('should call updateUser with user and nbCigarettes returned by getNbCigarettes', () => {
        const { value } = iterator.next(42);
        expect(value).toEqual(call(addConsumptionToUser, user, 42));
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
            state: 'qualified',
        }));
    });

    it('should end if nbCigarettes is null', () => {
        const it = handleAskedUser();
        const { done } = it.next();
        expect(done).toBe(true);
    });
});
