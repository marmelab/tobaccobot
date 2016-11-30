import expect from 'expect';

import evaluateHistory, { getCombo, isBackFromBad, getState } from './evaluateHistory';

describe('evaluateHistory', () => {
    const getStateSpy = expect.createSpy().andReturn('state');
    const getComboSpy = expect.createSpy().andReturn('combo');
    const isBackFromBadSpy = expect.createSpy().andReturn('backFromBad');
    const getDeltaSpy = expect.createSpy().andReturn('delta');
    const testEvaluateHistory = evaluateHistory
    .getState(getStateSpy)
    .getCombo(getComboSpy)
    .isBackFromBad(isBackFromBadSpy)
    .getDelta(getDeltaSpy);

    it('should return state, lambda, combo, backFromBad and delta', () => {
        expect(testEvaluateHistory(['val1', 'val2', 'val3'], 'targetConsumption'))
        .toEqual({
            state: 'state',
            delta: 'delta',
            combo: 'combo',
            backFromBad: 'backFromBad',
        });
    });

    it('should call getState with each value in history and targetConsumption', () => {
        expect(getStateSpy).toHaveBeenCalledWith('val1', 'targetConsumption');
        expect(getStateSpy).toHaveBeenCalledWith('val2', 'targetConsumption');
        expect(getStateSpy).toHaveBeenCalledWith('val3', 'targetConsumption');
    });

    it('should call isBackFromBad with good and good', () => {
        expect(isBackFromBadSpy).toHaveBeenCalledWith('state', 'state');
    });

    it('should call combo, with all result from getState', () => {
        expect(getComboSpy).toHaveBeenCalledWith(['state', 'state', 'state']);
    });

    it('should call getDelta with last two value from history', () => {
        expect(getDeltaSpy).toHaveBeenCalledWith('val2', 'val3');
    });


    describe('getCombo', () => {
        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'good', 'good'])).toBe(3);
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'bad', 'good', 'good'])).toBe(2);
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'good', 'good', 'bad'])).toBe(1);
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

    describe('getState', () => {
        it('should return good if value is <= to targetConsumption', () => {
            expect(getState(5, 5)).toBe('good');
            expect(getState(5, 6)).toBe('good');
        });
        it('should return bad if value is > to targetConsumption', () => {
            expect(getState(6, 5)).toBe('bad');
        });
    });
});
