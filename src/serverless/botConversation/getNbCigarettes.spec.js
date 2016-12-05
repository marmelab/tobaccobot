import expect from 'expect';

import getNbCigarettes from './getNbCigarettes';

describe('getNbCigarettes', () => {
    it('should getNbCigarettes if message is a number', () => {
        const nbCigarettes = getNbCigarettes('13');

        expect(nbCigarettes).toEqual(13);
    });

    it('should set user state to dubious if message is not a number', () => {
        const nbCigarettes = getNbCigarettes('I do not know');
        expect(nbCigarettes).toBe(null);
    });
});
