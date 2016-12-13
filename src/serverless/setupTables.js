import generatorToCPS from './utils/generatorToCPS';
import archive from './services/archive';
import smoker from './services/smoker';

export function* setupTables() {
    try {
        const result = yield [
            smoker.createTable(),
            archive.createTable(),
        ];

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

export default generatorToCPS(setupTables);
