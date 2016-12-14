import expect from 'expect';

import sortUserBySuccess, { hasStoppedSmoking } from './sortUserBySuccess';

describe('sortUserBySuccess', () => {
    it('should sort failed user from succesful one', () => {
        expect(sortUserBySuccess([
            { phone: 'phone1', history: [{ consumption: 0 }, { consumption: 0 }, { consumption: 0 }] },
            { phone: 'phone2', history: [{ consumption: 0 }, { consumption: 1 }, { consumption: 0 }] },
        ])).toEqual({
            success: [{ phone: 'phone1', history: [{ consumption: 0 }, { consumption: 0 }, { consumption: 0 }] }],
            failure: [{ phone: 'phone2', history: [{ consumption: 0 }, { consumption: 1 }, { consumption: 0 }] }],
        });
    });

    describe('hasStoppedSmoking', () => {
        it('should return true if user last three consumption are 0', () => {
            expect(hasStoppedSmoking({
                history: [
                    { consumption: 1 },
                    { consumption: 0 },
                    { consumption: 0 },
                    { consumption: 0 },
                ],
            })).toBe(true);
        });

        it('should return false if at least one of the user last three consumption is not 0', () => {
            expect(hasStoppedSmoking({
                history: [
                    { consumption: 0 },
                    { consumption: 0 },
                    { consumption: 1 },
                    { consumption: 0 },
                ],
            })).toBe(false);
        });

        it('should return false if less than 3 history', () => {
            expect(hasStoppedSmoking({
                history: [
                    { consumption: 0 },
                    { consumption: 0 },
                ],
            })).toBe(false);
        });
    });
});
