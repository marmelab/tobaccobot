import sg from 'sg.js';

import generatorToCPS from './utils/generatorToCPS';
import subscribeSaga from './subscribe/saga';

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
