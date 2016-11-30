export default function computeTargetConsumption(nbCigarettes) {
    return {
        1: (nbCigarettes * 3) / 4,
        2: (nbCigarettes * 2) / 4,
        3: (nbCigarettes * 1) / 4,
        4: (nbCigarettes * 0) / 4,
    };
}
