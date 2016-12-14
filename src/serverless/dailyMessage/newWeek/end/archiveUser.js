import { call } from 'sg.js';
import archive from '../../../services/archive';
import smoker from '../../../services/smoker';

export default function* (user) {
    yield call(smoker.delete, user.phone);
    const archivedUser = yield call(archive.archive, {
        ...user,
        state: 'ended',
    });

    return archivedUser;
}
