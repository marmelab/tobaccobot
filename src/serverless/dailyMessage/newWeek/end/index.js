import { call } from 'sg.js';

import archiveUser from './archiveUser';
import getEndedUsers from './getEndedUsers';
import sortUserBySuccess from './sortUserBySuccess';
import sendSuccessMessage from './sendSuccessMessage';
import sendFailureMessage from './sendFailureMessage';

export default function* end(users) {
    const endedUsers = yield call(getEndedUsers, users);

    const data = yield endedUsers.map(user => call(archiveUser, user));

    const { success, failure } = yield call(sortUserBySuccess, data);

    yield [
        call(sendSuccessMessage, success),
        call(sendFailureMessage, failure),
    ];
}
