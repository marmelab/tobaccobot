import expect from 'expect';

import addConsumptionToUser from './addConsumptionToUser';

describe('addConsumptionToUser', () => {
    it('should add consumption to history', () => {
        const user = {
            remainingDays: 13,
            week: 3,
            targetConsumption: {
                3: 17,
            },
            history: ['previous'],
        };
        expect(addConsumptionToUser(user, 19)).toEqual({
            ...user,
            remainingDays: 13,
            state: 'bad',
            history: [
                'previous',
                {
                    day: 15,
                    week: 3,
                    consumption: 19,
                    state: 'bad',
                },
            ],
        });
    });
});
