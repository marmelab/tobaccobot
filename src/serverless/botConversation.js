import exit from './services/exit';
import generatorToCPS from './utils/generatorToCPS';

import handleAction, { newMessage } from './saga';

export function* botConversation({ body }) {
    try {
        yield handleAction(newMessage(body));

        return {
            statusCode: 200,
            headers: {
            },
            body: 'Ok',
        };
    } catch (error) {
        console.error({ error });

        exit(1);
        return {
            statusCode: 500,
            headers: {
            },
            body: error.message,
        };
    }
}

export default generatorToCPS(botConversation);
