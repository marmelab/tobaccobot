import generatorToCPS from './utils/generatorToCPS';
import smokerTable from './services/smokerTable';

export function* subscribe(event, context) {
    const { name, tel } = event.body;
    return {
        statusCode: 200,
        headers: {
        },
        body: JSON.stringify({ name, tel }),
    };
}

export default generatorToCPS(subscribe);
