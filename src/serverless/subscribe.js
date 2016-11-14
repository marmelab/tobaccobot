import generatorToCPS from './utils/generatorToCPS';
import smoker from './services/smoker';

export function* subscribe(event, context) {
    try {
        const result = yield smoker.save(event.body);

        return {
            statusCode: 200,
            headers: {
            },
            body: result,
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
            },
            body: error.message,
        };
    }
}

export default generatorToCPS(subscribe);
