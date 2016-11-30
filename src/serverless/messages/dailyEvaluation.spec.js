import expect from 'expect';

import dailyEvaluationMessage, {
    backOnTrack,
    greatProgress,
    good,
    reallyGood,
    bad,
    reallyBad,
} from './dailyEvaluation';

describe('dailyEvaluation message', () => {
    it('should return good message if state is good', () => {
        expect(dailyEvaluationMessage({ state: 'good' })).toBe(good());
    });

    it('should return reallyGood message if state is good and combo 2', () => {
        expect(dailyEvaluationMessage({ state: 'good', combo: 2 })).toBe(reallyGood());
    });

    it('should return bad message if state is bad and combo 1', () => {
        expect(dailyEvaluationMessage({ state: 'bad', combo: 1, targetConsumption: 23 })).toBe(bad(23));
    });

    it('should return reallyBad message if state is bad and combo greater than 1', () => {
        expect(dailyEvaluationMessage({ state: 'bad', combo: 2 })).toBe(reallyBad());
    });

    it('should return backOnTrack message if backFromBad is true', () => {
        expect(dailyEvaluationMessage({ backFromBad: true })).toBe(backOnTrack());
    });

    it('should return greatProgress message if delta is at most -3', () => {
        expect(dailyEvaluationMessage({ delta: -3 })).toBe(greatProgress(-3));
    });
});
