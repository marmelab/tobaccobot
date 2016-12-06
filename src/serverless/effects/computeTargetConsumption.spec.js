import expect from 'expect';
import computeTargetConsumption from './computeTargetConsumption';

describe('computeTargetConsumption', () => {
    it('should return the targeted number of cigarettes', () => {
        expect(computeTargetConsumption(20)).toEqual({
            1: 15,
            2: 10,
            3: 5,
            4: 0,
        });
    });
});
