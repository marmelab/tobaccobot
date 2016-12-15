import expect from 'expect';

import getWeeklyMessageData from './getWeeklyMessageData';

describe('getWeeklyMessageData', () => {
    it('should compute remainingWeeks, oldTarget, newTarget and phone for each user', () => {
        expect(getWeeklyMessageData([
            {
                phone: '+331',
                targetConsumption: {
                    1: 3,
                    2: 2,
                    3: 1,
                    4: 0,
                },
                week: 1,
            },
            {
                phone: '+332',
                targetConsumption: {
                    1: 6,
                    2: 4,
                    3: 2,
                    4: 0,
                },
                week: 2,
            },
            {
                phone: '+333',
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
            phones: ['+331', '+332', '+333'],
            oldTarget: [3, 4, 4],
            newTarget: [2, 2, 0],
            remainingWeeks: [3, 2, 1],
            reportLink: [
                'http://report/?phone=%2B331',
                'http://report/?phone=%2B332',
                'http://report/?phone=%2B333',
            ],
        });
    });
});
