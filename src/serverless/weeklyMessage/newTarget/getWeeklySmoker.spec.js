import expect from 'expect';
import getWeeklySmoker from './getWeeklySmoker';

describe('getWeeklySmoker', () => {
    it('should correctly filter smokers', () => {
        const allSmokers = [{
            remainingDays: 21,
            state: 'asked',
        }, {
            remainingDays: 14,
            state: 'welcomed',
        }, {
            remainingDays: 7,
            state: 'dubious',
        }, {
            remainingDays: 21,
            state: 'stopped',
        }, {
            remainingDays: 14,
            state: 'stopped',
        }, {
            remainingDays: 7,
            state: 'stopped',
        }, {
            remainingDays: 42,
            state: 'asked',
        }, {
            remainingDays: 42,
            state: 'stopped',
        }];
        const expectedSmokers = [{
            remainingDays: 21,
            state: 'asked',
        }, {
            remainingDays: 14,
            state: 'welcomed',
        }, {
            remainingDays: 7,
            state: 'dubious',
        }];

        const smokers = getWeeklySmoker(allSmokers);

        expect(smokers).toEqual(expectedSmokers);
    });
});
