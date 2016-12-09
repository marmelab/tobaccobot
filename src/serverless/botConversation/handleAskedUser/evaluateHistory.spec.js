import expect from 'expect';

import evaluateHistory, {
    getCombo,
    getComboHistory,
    isBackFromBad,
    getDelta,
} from './evaluateHistory';

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
        expect(isBackFromBadSpy).toHaveBeenCalledWith(history);
    });

    it('should call combo, with all result from getState', () => {
        expect(getComboSpy).toHaveBeenCalledWith(history);
    });

    it('should call getDelta with last two value from history', () => {
        expect(getDeltaSpy).toHaveBeenCalledWith(history);
    });

    describe('getCombo', () => {
        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'good', 'good'].map(state => ({ state }))))
            .toEqual({ hit: 3, repeatition: 1 });
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'good', 'good', 'bad', 'good', 'good'].map(state => ({ state }))))
            .toEqual({
                hit: 2,
                repeatition: 2,
            });
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo([
                'good', 'good', 'good', 'good', 'good',
                'bad',
                'good', 'good', 'good', 'good',
            ].map(state => ({ state }))))
            .toEqual({
                hit: 4,
                repeatition: 5,
            });
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getCombo(['good', 'good', 'good', 'bad'].map(state => ({ state }))))
            .toEqual({
                hit: 1,
            });
        });

        it('should return combo of 0 if receiving empty array', () => {
            expect(getCombo([]))
            .toEqual({
                hit: 0,
            });
        });
    });

    describe('getComboHistory', () => {
        it('should return combo number of consecutive similar value at the end', () => {
            expect(getComboHistory(['good', 'good', 'good'].map(state => ({ state }))))
            .toEqual([{ state: 'good', hit: 3 }]);
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getComboHistory(['good', 'good', 'bad', 'good', 'good', 'good'].map(state => ({ state }))))
            .toEqual([
                { state: 'good', hit: 2 },
                { state: 'bad', hit: 1 },
                { state: 'good', hit: 3 },
            ]);
        });

        it('should return combo number of consecutive similar value at the end', () => {
            expect(getComboHistory(['good', 'good', 'good', 'bad'].map(state => ({ state }))))
            .toEqual([
                { state: 'good', hit: 3 },
                { state: 'bad', hit: 1 },
            ]);
        });

        it('should return combo of 0 if receiving empty array', () => {
            expect(getComboHistory([])).toEqual([]);
        });
    });

    describe('isBackFromBad', () => {
        it('should return false if previous value is good', () => {
            expect(isBackFromBad([{ state: 'good' }, { state: 'bad' }])).toBe(false);
            expect(isBackFromBad([{ state: 'good' }, { state: 'good' }])).toBe(false);
        });

        it('should return false if current value is still bad', () => {
            expect(isBackFromBad([{ state: 'bad' }, { state: 'bad' }])).toBe(false);
        });

        it('should return 1 if previous value is bad and current one is true', () => {
            expect(isBackFromBad([
                { state: 'bad' },
                { state: 'good' },
            ])).toBe(1);
        });

        it('should return 2 if 2 previous value are bad and current one is true', () => {
            expect(isBackFromBad([
                { state: 'good' },
                { state: 'bad' },
                { state: 'bad' },
                { state: 'good' },
            ])).toBe(2);
        });

        it('should return false if if one of the value is undefined', () => {
            expect(isBackFromBad([
                { state: 'bad' },
                { state: undefined },
            ])).toBe(false);
            expect(isBackFromBad([
                { state: 'good' },
                { state: undefined },
            ])).toBe(false);
            expect(isBackFromBad([
                { state: undefined },
                { state: 'bad' },
            ])).toBe(false);
            expect(isBackFromBad([
                { state: undefined },
                { state: 'good' },
            ])).toBe(false);
            expect(isBackFromBad([])).toBe(false);
        });
    });

    describe('getDelta', () => {
        it('should return a list of delta', () => {
            expect(getDelta([
                { consumption: 5 },
                { consumption: 5 },
                { consumption: 10 },
                { consumption: 5 },
            ])).toEqual([0, 5, -5]);
        });
    });
});
