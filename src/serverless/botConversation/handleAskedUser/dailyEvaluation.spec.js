import expect from 'expect';

import dailyEvaluationMessage, {
    backFromBad,
    backFromReallyBad,
    backFromBadCombo,
    greatProgress,
    good,
    reallyGood,
    goodCombo,
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

    it('should return goodCombo message if state is good and combo more than 2', () => {
        expect(dailyEvaluationMessage({ state: 'good', combo: 3 })).toBe(goodCombo());
    });

    it('should return bad message if state is bad and combo 1', () => {
        expect(dailyEvaluationMessage({ state: 'bad', combo: 1, targetConsumption: 23 })).toBe(bad(23));
    });

    it('should return reallyBad message if state is bad and combo greater than 1', () => {
        expect(dailyEvaluationMessage({ state: 'bad', combo: 2 })).toBe(reallyBad());
    });

    it('should return backFromBad message if backFromBad is 1', () => {
        expect(dailyEvaluationMessage({ backFromBad: 1 })).toBe(backFromBad());
    });

    it('should return backFromReallyBad message if backFromBad is 2', () => {
        expect(dailyEvaluationMessage({ backFromBad: 2 })).toBe(backFromReallyBad());
    });

    it('should return backFromBadCombo message if backFromBad is more than 2', () => {
        expect(dailyEvaluationMessage({ backFromBad: 3 })).toBe(backFromBadCombo());
    });

    it('should return greatProgress message if delta is at most -3', () => {
        expect(dailyEvaluationMessage({ delta: -3 })).toBe(greatProgress(-3));
    });
});
