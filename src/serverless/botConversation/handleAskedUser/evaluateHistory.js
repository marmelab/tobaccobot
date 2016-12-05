import configurable from 'configurable.js';

export const getDelta = (previous, current) => current - previous;

export const getCombo = (history) => {
    const { combo } = history.reduce((previous, { state }) => {
        if (previous.state === state) {
            return { state, combo: previous.combo + 1 };
        }

        return { state, combo: 1 };
    }, { combo: 0 });

    return combo;
};

export const isBackFromBad = (previousState, currentState) => previousState === 'bad' && currentState === 'good';

const evaluateHistory = function (history, targetConsumption) {
    const [previous, current] = history.slice(-2);

    return {
        targetConsumption,
        state: history.slice(-1)[0].state,
        backFromBad: this.config.isBackFromBad(previous.state, current.state),
        combo: this.config.getCombo(history),
        delta: this.config.getDelta(previous.consumption, current.consumption),
    };
};

export default configurable(evaluateHistory, {
    isBackFromBad,
    getCombo,
    getDelta,
});
