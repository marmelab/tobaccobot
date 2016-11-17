import generatorToCPS from './utils/generatorToCPS';
import smoker from './services/smoker';

export function* setupSmokerTable() {
    try {
        const result = yield smoker.createTable();
        setTimeout(() => {
            process.exit(0);
        }, 3000);
        return {
            statusCode: 200,
            headers: {
            },
            body: result,
        };
    } catch (error) {
        setTimeout(() => {
            process.exit(0);
        }, 3000);
        return {
            statusCode: 500,
            headers: {
            },
            body: error.message,
        };
    }
}

export default generatorToCPS(setupSmokerTable);
