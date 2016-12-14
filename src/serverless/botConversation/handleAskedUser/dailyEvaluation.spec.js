import expect from 'expect';

import dailyEvaluationMessage, {
    backFromBad,
    backFromReallyBad,
    backFromBadCombo,
    greatProgress,
    continuedGreatProgress,
    good,
    reallyGood,
    goodCombo,
    bad,
    reallyBad,
    reallyBadLinks,
    badCombo,
    badComboLinks,
} from './dailyEvaluation';

describe('dailyEvaluation message', () => {
    it('should return good message if state is good', () => {
        expect(dailyEvaluationMessage({ state: 'good', delta: [], combo: { hit: 1 } })).toBe(good());
    });

    it('should return reallyGood message if state is good and combo 2', () => {
        expect(dailyEvaluationMessage({ state: 'good', combo: { hit: 2 }, delta: [] })).toBe(reallyGood());
    });

    it('should return goodCombo message if state is good and combo more than 2', () => {
        expect(dailyEvaluationMessage({ state: 'good', combo: { hit: 3 }, delta: [] })).toBe(goodCombo(3));
    });

    it('should return bad message if state is bad and combo 1', () => {
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 1 }, targetConsumption: 23, delta: [] })).toBe(bad(23));
    });

    it('should return reallyBad message with link based on repeatition if state is bad and combo greater than 1', () => {
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 2, repeatition: 1 }, delta: [] }))
        .toBe(reallyBad(reallyBadLinks[0]));
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 2, repeatition: 2 }, delta: [] }))
        .toBe(reallyBad(reallyBadLinks[1]));
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 2, repeatition: 3 }, delta: [] }))
        .toBe(reallyBad(reallyBadLinks[2]));
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 2, repeatition: 4 }, delta: [] }))
        .toBe(reallyBad(reallyBadLinks[0]));
    });

    it('should return badCombo message with link based on repeatition if state is bad and combo greater than 2', () => {
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 3, repeatition: 1 }, targetConsumption: 19, delta: [] }))
        .toBe(badCombo(3, 19, badComboLinks[0]));
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 3, repeatition: 2 }, targetConsumption: 19, delta: [] }))
        .toBe(badCombo(3, 19, badComboLinks[1]));
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 3, repeatition: 3 }, targetConsumption: 19, delta: [] }))
        .toBe(badCombo(3, 19, badComboLinks[2]));
        expect(dailyEvaluationMessage({ state: 'bad', combo: { hit: 3, repeatition: 4 }, targetConsumption: 19, delta: [] }))
        .toBe(badCombo(3, 19, badComboLinks[0]));
    });

    it('should return backFromBad message if backFromBad is 1', () => {
        expect(dailyEvaluationMessage({ backFromBad: 1, delta: [] })).toBe(backFromBad());
    });

    it('should return backFromReallyBad message if backFromBad is 2', () => {
        expect(dailyEvaluationMessage({ backFromBad: 2, delta: [] })).toBe(backFromReallyBad());
    });

    it('should return backFromBadCombo message if backFromBad is more than 2', () => {
        expect(dailyEvaluationMessage({ backFromBad: 3, delta: [] })).toBe(backFromBadCombo());
    });

    it('should return greatProgress message if delta is at most -3', () => {
        expect(dailyEvaluationMessage({ delta: [0, -3] })).toBe(greatProgress(-3));
    });

    it('should return continuedGreatProgress message if delta is at most -3 at least 2 days in a row', () => {
        expect(dailyEvaluationMessage({ delta: [-3, -4] })).toBe(continuedGreatProgress(-4));
    });
});
