import generatorToCPS from './utils/generatorToCPS';
import { pgPool } from 'co-postgres-queries';

export function* subscribe(event, context) {
    return {
        statusCode: 200,
        headers: {
        },
        body: JSON.stringify({ message: 'result' }),
    };
}

export default generatorToCPS(subscribe);
