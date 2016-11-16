import expect from 'expect';

import cpsToPromise from './cpsToPromise';

describe('cpsToPromise', () => {
    const cps = function (a, b, cb) {
        if (!cb) {
            throw new Error('thrown error');
        }
        if (!a || !b) {
            return cb(new Error('callback error'));
        }
        return cb(null, `result: ${a + b}`);
    };

    it('should convert cps to a promise resolving with cb result', (done) => {
        const fn = cpsToPromise(cps);
        fn(2, 3).then((result) => {
            expect(result).toBe('result: 5');
            done();
        })
        .catch(done);
    });

    it('should convert cps to a promise rejecting with cb error', (done) => {
        const fn = cpsToPromise(cps);

        fn(2, null)
        .then(() => {
            throw new Error('fn should have been rejected');
        })
        .catch((error) => {
            expect(error.message).toBe('callback error');
            done();
        })
        .catch(done);
    });

    it('should return a promise that reject with error thrown by original function if any', (done) => {
        const fn = cpsToPromise(cps);

        fn(2)
        .then(() => {
            throw new Error('fn should have been rejected');
        })
        .catch((error) => {
            expect(error.message).toBe('thrown error');
            done();
        })
        .catch(done);
    });
});
