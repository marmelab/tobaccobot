import generatorToCPS from './utils/generatorToCPS';
import sg, { call } from 'sg/sg';

import createUser from './effects/createUser';
import sendWelcomeMessage from './effects/sendWelcomeMessage';
import updateUser from './effects/updateUser';

export function* subscribeSaga(userData) {
    const user = yield call(createUser, userData);
    yield call(sendWelcomeMessage, user);
    yield call(updateUser, { ...user, state: 'welcomed' });
    return user;
}

export function* subscribeLambda({ body }) {
    try {
        const user = yield sg(subscribeSaga)(body);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: user,
        };
    } catch (error) {
        console.error({ error });

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: error.message,
        };
    }
}

export default generatorToCPS(subscribeLambda);
