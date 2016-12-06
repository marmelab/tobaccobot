import expect from 'expect';

import weeklyMessage from './weeklyMessage';
import smoker from './services/smoker';
import { setupSmokerTable } from './setupSmokerTable';

describe.only('weeklyMessage functional', () => {
    let smokers;
    before(function* () {
        yield setupSmokerTable();
        smokers = yield [
            {
                name: 'successfulUser',
                phone: '+33111111111',
                state: 'qualified',
                remainingDays: 0,
                week: 4,
                targetConsumption: {
                    1: 15,
                    2: 10,
                    3: 5,
                    4: 0,
                },
                history: [
                    { consumption: 0, state: 'good' },
                    { consumption: 0, state: 'good' },
                    { consumption: 0, state: 'good' },
                ],
            },
            {
                name: 'failedUser',
                phone: '+33222222222',
                state: 'qualified',
                remainingDays: 0,
                week: 4,
                targetConsumption: {
                    1: 15,
                    2: 10,
                    3: 5,
                    4: 0,
                },
                history: [
                    { consumption: 0, state: 'good' },
                    { consumption: 1, state: 'bad' },
                    { consumption: 0, state: 'good' },
                ],
            },
            {
                name: 'endOfWeek',
                phone: '+33333333333',
                state: 'qualified',
                remainingDays: 7,
                week: 3,
                targetConsumption: {
                    1: 6,
                    2: 4,
                    3: 2,
                    4: 0,
                },
                history: [
                    { consumption: 0, state: 'good' },
                    { consumption: 1, state: 'bad' },
                    { consumption: 0, state: 'good' },
                ],
            },
            {
                name: 'ignored',
                phone: '+33444444444',
                state: 'qualified',
                remainingDays: 9,
                week: 3,
                targetConsumption: {
                    1: 9,
                    2: 6,
                    3: 3,
                    4: 0,
                },
                history: [
                    { consumption: 0, state: 'good' },
                    { consumption: 1, state: 'bad' },
                    { consumption: 0, state: 'good' },
                ],
            },
        ].map(smoker.save);

        yield cb => weeklyMessage(null, null, cb);
    });

    it('should have deleted smoker successfulUser', function* () {
        const successfulUser = yield smoker.get('+33111111111');
        expect(successfulUser).toEqual({});
    });

    it('should have deleted smoker failedUser', function* () {
        const successfulUser = yield smoker.get('+33222222222');
        expect(successfulUser).toEqual({});
    });

    it('should have incremented week of smoker endOfWeek by 1', function* () {
        const successfulUser = yield smoker.get('+33333333333');
        expect(successfulUser).toEqual({
            ...smokers[2],
            week: 4,
        });
    });

    it('should have left ignored smoker as is', function* () {
        const successfulUser = yield smoker.get('+33444444444');
        expect(successfulUser).toEqual(smokers[3]);
    });
});
