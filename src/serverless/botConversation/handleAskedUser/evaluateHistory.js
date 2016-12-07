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

export const getComboHistory = history =>
    history.reduce(({ previous, comboHistory }, { state }) => {
        if (previous === state) {
            const lastCombo = comboHistory.slice(-1)[0];
            return {
                previous: state,
                comboHistory: [
                    ...comboHistory.slice(0, -1),
                    {
                        ...lastCombo,
                        hit: lastCombo.hit + 1,
                    },
                ],
            };
        }

        return {
            previous: state,
            comboHistory: [...comboHistory, { state, hit: 1 }],
        };
    }, { previous: undefined, comboHistory: [] }).comboHistory;

export const getCombo = (history) => {
    const comboHistory = getComboHistory(history);
    const lastCombo = comboHistory.slice(-1)[0];

    if (!lastCombo) {
        return { hit: 0 };
    }

    if (lastCombo.hit < 2) {
        return { hit: lastCombo.hit };
    }
    if (lastCombo.hit === 2) {
        return {
            hit: lastCombo.hit,
            repeatition: comboHistory
            .filter(data => data.state === lastCombo.state && data.hit >= 2)
            .length,
        };
    }

    return {
        hit: lastCombo.hit,
        repeatition: comboHistory
        .filter(data => data.state === lastCombo.state && data.hit > 2)
        .reduce((result, { hit }) => result + (hit - 2), 0),
    };
};

export const isBackFromBad = (history) => {
    const [previous = {}, current = {}] = history.slice(-2);
    if (!previous || previous.state !== 'bad' || !current || current.state !== 'good') {
        return false;
    }
    return getCombo(history.slice(0, -1)).hit;
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
