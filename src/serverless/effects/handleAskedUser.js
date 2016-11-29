import { call } from 'sg.js';

import getNbCigarettes from './getNbCigarettes';
import smoker from '../services/smoker';

const updateUser = (user, nbCigarettes) => ({
    ...user,
    remainingDays: user.remainingDays - 1,
    history: (user.history || []).concat(nbCigarettes),
});

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
