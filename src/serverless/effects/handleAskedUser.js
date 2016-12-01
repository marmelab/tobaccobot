import { call } from 'sg.js';

import getNbCigarettes from './getNbCigarettes';
import smoker from '../services/smoker';
import evaluateHistory from './evaluateHistory';
import sendDailyEvaluationMessage from './sendDailyEvaluationMessage';
import addConsumptionToUser from './addConsumptionToUser';

export default function* handleAskedUser(message, user) {
    const nbCigarettes = yield call(getNbCigarettes, message.text);
    if (!nbCigarettes) {
        return;
    }

    const updatedUser = yield call(addConsumptionToUser, user, nbCigarettes);
    const evaluation = yield call(evaluateHistory, updatedUser.history, updatedUser.targetConsumption);
    yield call(sendDailyEvaluationMessage, updatedUser.phone, evaluation);
    yield call(smoker.save, {
        ...updatedUser,
        state: 'qualified',
    });
}
