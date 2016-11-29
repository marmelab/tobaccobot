import { call } from 'sg.js';

import getNbCigarettes from './getNbCigarettes';
import smoker from '../services/smoker';

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
    const updatedUser = yield call(updateUser, user, nbCigarettes);
    yield call(smoker.save, {
        ...updatedUser,
    });
    if (!nbCigarettes) {
        return;
    }
}
