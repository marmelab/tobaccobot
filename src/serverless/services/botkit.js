import botkit from 'botkit';

import dynamoDBStorage from './dynamoDBStorage';

const controller = botkit.consolebot({
    debug: false,
    storage: dynamoDBStorage,
});

controller.on('message_received', (bot, message) => {
    bot.send({ text: `I heard ${message}` });
    setTimeout(() => {
        process.exit();
    }, 3000);
});

const bot = controller.spawn();

export default {
    ...bot,
    controller,
};
