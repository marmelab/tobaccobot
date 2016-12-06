import { value } from 'nlp_compromise';

export default function getNbCigarettes(message) {
    const nbCigarettes = parseInt(value(message).number, 10);

    if (isNaN(nbCigarettes)) {
        return null;
    }

    return nbCigarettes;
}
