import { call } from 'sg.js';

import askDailyMessage from '../messages/askDaily';
import sendSms from '../services/sendSms';
import smoker from '../services/smoker';

export const getMessages = users => ({
    message: askDailyMessage(),
    phones: users.map(user => user.phone),
});

export const setStateToAsked = users =>
    users
    .map(user => ({
        ...user,
        state: 'asked',
    }));


export default function* notifyDubious(users) {
    if (!users) {
        return;
    }
    const { message, phones } = yield call(getMessages, users);
    yield call(sendSms, phones, message);
    const askedUsers = yield call(setStateToAsked, users);

    yield askedUsers.map(user => call(smoker.save, user));
}
