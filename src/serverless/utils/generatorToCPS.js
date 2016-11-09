import co from 'co';

export default gen => (...allArgs) => {
    const cb = allArgs.slice(-1)[0];
    const args = allArgs.slice(0, -1);

    return co(gen(args))
    .then(result => cb(null, result))
    .catch(error => cb(error));
};
