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
                        combo: lastCombo.combo + 1,
                    },
                ],
            };
        }

        return {
            previous: state,
            comboHistory: [...comboHistory, { state, combo: 1 }],
        };
    }, { previous: undefined, comboHistory: [] }).comboHistory;

export const getCombo = (history) => {
    const comboHistory = getComboHistory(history);
    const lastCombo = comboHistory.slice(-1)[0];

    if (!lastCombo) {
        return { combo: 0 };
    }

    if (lastCombo.combo < 2) {
        return { combo: lastCombo.combo };
    }
    if (lastCombo.combo === 2) {
        return {
            combo: lastCombo.combo,
            repeatition: comboHistory
            .filter(data => data.state === lastCombo.state && data.combo >= 2)
            .length,
        };
    }

    return {
        combo: lastCombo.combo,
        repeatition: comboHistory
        .filter(data => data.state === lastCombo.state && data.combo > 2)
        .reduce((result, { combo }) => result + (combo - 2), 0),
    };
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
