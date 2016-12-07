import configurable from 'configurable.js';

export const getDelta = history =>
    history.reduce(({ previous, delta }, { consumption }) => {
        if (!previous) {
            return {
                previous: consumption,
                delta,
            };
        }
        return {
            previous: consumption,
            delta: delta.concat(consumption - previous),
        };
    }, { delta: [], previous: undefined }).delta;


export const getCombo = (history) => {
    const { combo } = history.reduce((previous, { state }) => {
        if (previous.state === state) {
            return { state, combo: previous.combo + 1 };
        }

        return { state, combo: 1 };
    }, { combo: 0 });

    return combo;
};

export const isBackFromBad = (history) => {
    const [previous = {}, current = {}] = history.slice(-2);
    if (!previous || previous.state !== 'bad' || !current || current.state !== 'good') {
        return false;
    }
    return getCombo(history.slice(0, -1));
};

const evaluateHistory = function (history, targetConsumption) {
    return {
        targetConsumption,
        state: history.slice(-1)[0].state,
        backFromBad: this.config.isBackFromBad(history),
        combo: this.config.getCombo(history),
        delta: this.config.getDelta(history),
    };
};

export default configurable(evaluateHistory, {
    isBackFromBad,
    getCombo,
    getDelta,
});
