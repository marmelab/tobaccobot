export default function qualifyUser(message) {
    const nbCigarettes = parseInt(message, 10);
    if (isNaN(nbCigarettes)) {
        return { state: 'dubious' };
    }

    return { state: 'qualified', nbCigarettes };
}
