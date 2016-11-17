import generatorToCPS from './utils/generatorToCPS';
import smoker from './services/smoker';
import welcome from './welcome';

export function* subscribe(event) {
    try {
        const smokerData = {
            ...event.body,
            state: 'subscribed',
        };
        smoker.check(smokerData);
        const result = yield smoker.save(smokerData);
        yield welcome(smokerData);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: result,
        };
    } catch (error) {
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
