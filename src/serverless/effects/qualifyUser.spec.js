import expect from 'expect';

import qualifyUser from './qualifyUser';

describe('qualifyUser', () => {
    it('should qualifyUser if message is a number', function* () {
        const { state, nbCigarettes } = yield qualifyUser('13');

        expect(state).toEqual('qualified');
        expect(nbCigarettes).toEqual(13);
    });

    it('should set user state to dubious if message is not a number', function* () {
        const { state, nbCigarettes } = yield qualifyUser('I do not know');

        expect(state).toEqual('dubious');
        expect(nbCigarettes).toNotExist();
    });
});
