import exit from './services/exit';
import generatorToCPS from './utils/generatorToCPS';

import botFactory from './services/botkit';

export function* botConversation({ body }) {
    try {
        const bot = botFactory();
        bot.controller.trigger('message_received', [bot, body]);
        return {
            statusCode: 200,
            headers: {
            },
            body: 'Ok',
        };
    } catch (error) {
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
