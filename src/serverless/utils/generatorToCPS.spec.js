import expect from 'expect';

import generatorToCPS from './generatorToCPS';

describe('generatorToCPS', () => {
    const gen = function* (a, b) {
        if (!a || !b) {
            throw new Error('boom');
        }
        return yield Promise.resolve(`result: ${a + b}`);
    };

    it('should convert generator to cps function passing result into callback second argument', (done) => {
        const fn = generatorToCPS(gen);
        fn(2, 3, (error, result) => {
            try {
                expect(error).toBe(null);
                expect(result).toBe('result: 5');
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('should convert generator to cps function passing error into callback first argument', (done) => {
        const fn = generatorToCPS(gen);

        fn(2, (error, result) => {
            try {
                expect(result).toBe(undefined);
                expect(error.message).toBe('boom');
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});
