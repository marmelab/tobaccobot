import generatorToCPS from './utils/generatorToCPS';

import botFactory from './services/botkit';

export default function botConversation(message) {
    try {
        const bot = botFactory();
        bot.controller.trigger('message_received', [bot, message]);
        return {
            statusCode: 200,
            headers: {
            },
            body: 'Ok',
        };
    } catch (error) {
        setTimeout(() => {
            process.exit(1);
        }, 3000);
        return {
            statusCode: 500,
            headers: {
            },
            body: error.message,
        };
    }
}
