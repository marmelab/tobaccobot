import generatorToCPS from './utils/generatorToCPS';
import handleAction, { subscribe } from './saga';

export function* subscribeLambda(event) {
    try {
        const user = yield handleAction(subscribe(event.body));

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
