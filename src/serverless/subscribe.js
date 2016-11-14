import generatorToCPS from './utils/generatorToCPS';
import smoker from './services/smoker';

export function* subscribe(event) {
    try {
        smoker.check(event.body);
        const result = yield smoker.save(event.body);

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
