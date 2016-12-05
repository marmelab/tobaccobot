import { call } from 'sg.js';

import smoker from '../../services/smoker';
import getEndedUsers from './getEndedUsers';
import sortUserBySuccess from './sortUserBySuccess';
import sendSuccessMessage from './sendSuccessMessage';
import sendFailureMessage from './sendFailureMessage';

export default function* end(users) {
    const endedUsers = yield call(getEndedUsers, users);
    const { success, failure } = yield call(sortUserBySuccess, endedUsers);
    yield [
        call(sendSuccessMessage, success),
        call(sendFailureMessage, failure),
    ];

    yield endedUsers.map(({ phone }) => call(smoker.delete, phone));
}
