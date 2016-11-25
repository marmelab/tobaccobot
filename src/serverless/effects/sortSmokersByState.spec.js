import expect from 'expect';

import sortSmokerByState from './sortSmokersByState';

describe('sortSmokerByState', () => {
    it('should sort smokers by their states', () => {
        expect(sortSmokerByState([
            { state: 'welcomed', name: 'john' },
            { state: 'dubious', name: 'jim' },
            { state: 'welcomed', name: 'jane' },
            { state: 'dubious', name: 'janet' },
        ])).toEqual({
            welcomed: [
                { state: 'welcomed', name: 'john' },
                { state: 'welcomed', name: 'jane' },
            ],
            dubious: [
                { state: 'dubious', name: 'jim' },
                { state: 'dubious', name: 'janet' },
            ],
        });
    });

    it('should discard user with no state', () => {
        expect(sortSmokerByState([
            { name: 'john' },
            { name: 'jim' },
            { name: 'jane' },
            { name: 'janet' },
        ])).toEqual({});
    });

    it('should return empty object if no user', () => {
        expect(sortSmokerByState()).toEqual({});
    });
});
