import botkit from 'botkit';
import co from 'co';

import dynamoDBStorage from './dynamoDBStorage';
import qualifyUser from './qualifyUser';

const controller = botkit.consolebot({
    debug: false,
    storage: dynamoDBStorage,
});

controller.on('message_received', (bot, message) => {
    co(function* () {
        const user = yield controller.storage.users.get(message.user);
        if (user && user.state === 'welcomed') {
            yield qualifyUser(bot, user, message);
            bot.send({ text: `I heard ${message.text}` });
        }
        setTimeout(() => {
            process.exit();
        }, 3000);
    });
});

const bot = controller.spawn();

export default {
    ...bot,
    controller,
};
