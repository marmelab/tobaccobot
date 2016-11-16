import botkit from 'botkit';

import dynamoDBStorage from './dynamoDBStorage';

export const consoleController = botkit.consolebot({
    debug: false,
    storage: dynamoDBStorage,
});

consoleController.on('message_received', (bot, message) => {
    bot.send({ text: `I heard ${message}` });
});
