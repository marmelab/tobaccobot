import { call } from 'sg.js';

import askDubiousMessage from './askDubious';
import sendSms from '../services/sendSms';
import smoker from '../services/smoker';

export const getMessages = users => ({
    message: askDubiousMessage(),
    phones: users.map(user => user.phone),
});

export const setStateToWelcomed = users =>
    users.map(user => ({
        ...user,
        state: 'welcomed',
    }));

export default function* notifyDubious(users) {
    if (!users) {
        return;
    }
    const { message, phones } = yield call(getMessages, users);
    yield call(sendSms, phones, message);

    const updatedUsers = yield call(setStateToWelcomed, users);
    yield updatedUsers.map(user => call(smoker.save, user));
}
