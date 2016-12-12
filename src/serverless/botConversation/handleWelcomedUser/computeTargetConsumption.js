export default function computeTargetConsumption(nbCigarettes) {
    return {
        1: Math.floor((nbCigarettes * 3) / 4),
        2: Math.floor((nbCigarettes * 2) / 4),
        3: Math.floor((nbCigarettes * 1) / 4),
        4: 0,
    };
}
