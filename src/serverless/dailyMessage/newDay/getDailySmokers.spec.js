import expect from 'expect';
import getDailySmokers from './getDailySmokers';

describe('getDailySmokers', () => {
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
            remainingDays: 0,
            state: 'asked',
        }, {
            remainingDays: 42,
            state: 'stopped',
        }];
        const expectedSmokers = [{
            remainingDays: 42,
            state: 'asked',
        }];

        const smokers = getDailySmokers(allSmokers);

        expect(smokers).toEqual(expectedSmokers);
    });
});
