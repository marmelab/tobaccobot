export default (smokers = []) =>
    smokers.reduce((result, smoker) => {
        if (!smoker.state) {
            return result;
        }
        return {
            ...result,
            [smoker.state]: (result[smoker.state] || []).concat(smoker),
        };
    }, {});
