import botkit from 'botkit';
import co from 'co';

import dynamoDBStorage from './dynamoDBStorage';
import qualifyUser from './qualifyUser';
import exit from './exit';

export default () => {
    const controller = botkit.consolebot({
        debug: false,
        storage: dynamoDBStorage,
    });

    controller.on('message_received', (bot, message) => {
        co(function* () {
            try {
                const user = yield controller.storage.users.get(message.user);
                if (user && user.state === 'welcomed') {
                    yield qualifyUser(bot, user, message);
                }
                exit(0);
            } catch (error) {
                exit(1);
            }
        });
    });

    const bot = controller.spawn();

    return {
        ...bot,
        controller,
    };
};
