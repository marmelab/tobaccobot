import sg, { call } from 'sg.js';
import generatorToCPS from './utils/generatorToCPS';

import createUser from './effects/createUser';
import sendWelcomeMessage from './effects/sendWelcomeMessage';
import updateUser from './effects/updateUser';

export function* subscribeSaga(smokerData) {
    let smoker = yield call(createUser, smokerData);
    yield call(sendWelcomeMessage, smoker);
    smoker = yield call(updateUser, { ...smoker, state: 'welcomed' });
    return smoker;
}

export function* subscribe({ body }) {
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

export default generatorToCPS(subscribe);
