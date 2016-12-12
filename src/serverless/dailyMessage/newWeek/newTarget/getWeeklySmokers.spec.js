import expect from 'expect';
import getWeeklySmokers from './getWeeklySmokers';

describe('getWeeklySmokers', () => {
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
            remainingDays: 42,
            state: 'asked',
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

        const smokers = getWeeklySmokers(allSmokers);

        expect(smokers).toEqual(expectedSmokers);
    });
});
