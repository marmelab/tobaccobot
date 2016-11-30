import configurable from 'configurable.js';

export const getDelta = (previous, current) => current - previous;

export const getCombo = (history) => {
    const { combo } = history.reduce((result, currentState) => {
        if (result.state === currentState) {
            return { state: currentState, combo: result.combo + 1 };
        }

        return { state: currentState, combo: 1 };
    }, { combo: 0 });

    return combo;
};

export const isBackFromBad = (previousState, currentState) => previousState === 'bad' && currentState === 'good';

export const getState = (current, week, targetConsumption) => (current <= targetConsumption[week] ? 'good' : 'bad');

const evaluateHistory = function (history, targetConsumption) {
    const [previous, current] = history.slice(-2);
    const stateHistory = history.map(nb => this.config.getState(nb, targetConsumption));
    const [previousState, currentState] = stateHistory.slice(-2);

    return {
        targetConsumption,
        state: stateHistory.slice(-1)[0],
        backFromBad: this.config.isBackFromBad(previousState, currentState),
        combo: this.config.getCombo(stateHistory),
        delta: this.config.getDelta(previous, current),
    };
};

export default configurable(evaluateHistory, {
    getState,
    isBackFromBad,
    getCombo,
    getDelta,
});
