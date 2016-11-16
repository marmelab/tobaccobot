import generatorToCPS from './utils/generatorToCPS';

import { consoleController } from './services/botkit';

export function* botConversation({ message }) {
    try {
        const bot = consoleController.spawn();
        consoleController.trigger('message_received', [bot, message]);

        return {
            statusCode: 200,
            headers: {
            },
            body: 'Ok',
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

export default generatorToCPS(botConversation);
