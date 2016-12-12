import expect from 'expect';

import getWeeklyMessageData from './getWeeklyMessageData';

describe('getWeeklyMessageData', () => {
    it('should compute remainingWeeks, oldTarget, newTarget and phone for each user', () => {
        expect(getWeeklyMessageData([
            {
                phone: 1,
                targetConsumption: {
                    1: 3,
                    2: 2,
                    3: 1,
                    4: 0,
                },
                week: 1,
            },
            {
                phone: 2,
                targetConsumption: {
                    1: 6,
                    2: 4,
                    3: 2,
                    4: 0,
                },
                week: 2,
            },
            {
                phone: 3,
                targetConsumption: {
                    1: 12,
                    2: 8,
                    3: 4,
                    4: 0,
                },
                week: 3,
            },
        ]))
        .toEqual({
            phones: [1, 2, 3],
            oldTarget: [3, 4, 4],
            newTarget: [2, 2, 0],
            remainingWeeks: [3, 2, 1],
        });
    });
});
