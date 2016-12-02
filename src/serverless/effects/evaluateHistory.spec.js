import expect from 'expect';

import evaluateHistory, { getCombo, isBackFromBad } from './evaluateHistory';

describe('evaluateHistory', () => {
    const getComboSpy = expect.createSpy().andReturn('combo');
    const isBackFromBadSpy = expect.createSpy().andReturn('backFromBad');
    const getDeltaSpy = expect.createSpy().andReturn('delta');
    const testEvaluateHistory = evaluateHistory
    .getCombo(getComboSpy)
    .isBackFromBad(isBackFromBadSpy)
    .getDelta(getDeltaSpy);

    const history = [
        { state: 'state1', consumption: 1 },
        { state: 'state2', consumption: 2 },
        { state: 'state3', consumption: 3 },
    ];

    it('should return state, lambda, combo, backFromBad and delta', () => {
        expect(testEvaluateHistory(history, 'targetConsumption'))
        .toEqual({
            targetConsumption: 'targetConsumption',
            state: 'state3',
            delta: 'delta',
            combo: 'combo',
            backFromBad: 'backFromBad',
        });
    });

    it('should call isBackFromBad with state2 and state3', () => {
        expect(isBackFromBadSpy).toHaveBeenCalledWith('state2', 'state3');
    });

    it('should call combo, with all result from getState', () => {
        expect(getComboSpy).toHaveBeenCalledWith(history);
    });

    it('should call getDelta with last two value from history', () => {
        expect(getDeltaSpy).toHaveBeenCalledWith(2, 3);
    });


    describe('getCombo', () => {
        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'good', 'good'].map(state => ({ state })))).toBe(3);
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'bad', 'good', 'good'].map(state => ({ state })))).toBe(2);
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'good', 'good', 'bad'].map(state => ({ state })))).toBe(1);
        });

        it('should return combo of 0 if receiving empty array', () => {
            expect(getCombo([])).toBe(0);
        });
    });

    describe('isBackFromBad', () => {
        it('should return false if previous value is good', () => {
            expect(isBackFromBad('good', 'bad')).toBe(false);
            expect(isBackFromBad('good', 'good')).toBe(false);
        });

        it('should return false if current value is still bad', () => {
            expect(isBackFromBad('bad', 'bad')).toBe(false);
        });

        it('should return true if previous value is bad and current one is true', () => {
            expect(isBackFromBad('bad', 'good')).toBe(true);
        });

        it('should return false if if one of the value is undefined', () => {
            expect(isBackFromBad('bad')).toBe(false);
            expect(isBackFromBad('good')).toBe(false);
            expect(isBackFromBad(undefined, 'bad')).toBe(false);
            expect(isBackFromBad(undefined, 'good')).toBe(false);
        });
    });
});
