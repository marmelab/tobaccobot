import { call } from 'sg.js';

import getNbCigarettes from './getNbCigarettes';
import smoker from '../services/smoker';
import evaluateHistory from './evaluateHistory';

export const updateUser = (user, nbCigarettes) => {
    const history = (user.history || []).concat(nbCigarettes);

    return {
        ...user,
        remainingDays: user.remainingDays - 1,
        history,
    };
};

export default function* handleWelcomedUser(message, user) {
    const nbCigarettes = yield call(getNbCigarettes, message.text);
    if (!nbCigarettes) {
        return;
    }


    const updatedUser = yield call(updateUser, user, nbCigarettes);
    const evaluation = evaluateHistory(updatedUser.history, updatedUser.targetConsumption);

    yield call(smoker.save, {
        ...updatedUser,
        state: evaluation.state,
    });
}
