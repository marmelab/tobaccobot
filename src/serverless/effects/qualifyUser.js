export default function qualifyUser(user, message) {
    const nbCigarettes = parseInt(message.text, 10);
    if (isNaN(nbCigarettes)) {
        return { state: 'dubious' };
    }

    return { state: 'qualified', nbCigarettes };
}
