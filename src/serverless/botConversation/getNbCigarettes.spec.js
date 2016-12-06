import expect from 'expect';

import getNbCigarettes from './getNbCigarettes';

describe('getNbCigarettes', () => {
    it('should getNbCigarettes if message is a number', () => {
        const nbCigarettes = getNbCigarettes('13');

        expect(nbCigarettes).toEqual(13);
    });

    it('should getNbCigarettes if message is a number variation (about)', () => {
        const nbCigarettes = getNbCigarettes('about 13');

        expect(nbCigarettes).toEqual(13);
    });

    it('should getNbCigarettes if message is a number variation (less than)', () => {
        const nbCigarettes = getNbCigarettes('less than 13');

        expect(nbCigarettes).toEqual(13);
    });

    it('should getNbCigarettes if message is a number variation (more than)', () => {
        const nbCigarettes = getNbCigarettes('more than 13');

        expect(nbCigarettes).toEqual(13);
    });

    it('should getNbCigarettes if message is a number variation (X cigarettes)', () => {
        const nbCigarettes = getNbCigarettes('13 cigarettes');

        expect(nbCigarettes).toEqual(13);
    });

    it('should getNbCigarettes if message is a number variation (thirteen)', () => {
        const nbCigarettes = getNbCigarettes('thirteen');

        expect(nbCigarettes).toEqual(13);
    });

    it('should return null if message is not a number', () => {
        const nbCigarettes = getNbCigarettes('I do not know');
        expect(nbCigarettes).toBe(null);
    });
});
