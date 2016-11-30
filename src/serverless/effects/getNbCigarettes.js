export default function getNbCigarettes(message) {
    const nbCigarettes = parseInt(message, 10);
    if (isNaN(nbCigarettes)) {
        return null;
    }

    return nbCigarettes;
}
