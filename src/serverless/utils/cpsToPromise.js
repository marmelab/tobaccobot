export default (fn, ctx) => (...args) =>
    new Promise((resolve, reject) => {
        try {
            fn.call(ctx, ...args, (error, result) => {
                if (error) {
                    console.log({ error });
                    return reject(error);
                }
                return resolve(result);
            });
        } catch (error) {
            console.log({ error });
            reject(error);
        }
    });
