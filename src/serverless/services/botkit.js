import botkit from 'botkit';
import co from 'co';

import dynamoDBStorage from './dynamoDBStorage';
import qualifyUser from './qualifyUser';

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
                setTimeout(() => {
                    process.exit();
                }, 3000);
            } catch (error) {
                console.error(error);
                setTimeout(() => {
                    process.exit(1);
                }, 3000);
            }
        });
    });

    const bot = controller.spawn();

    return {
        ...bot,
        controller,
    };
};
