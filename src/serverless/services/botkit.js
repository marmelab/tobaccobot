import botkit from 'botkit';
import dynamoDBStorage from './dynamoDBStorage';

export default () => {
    const controller = botkit.consolebot({
        debug: false,
        storage: dynamoDBStorage,
    });

    const bot = controller.spawn();

    return {
        ...bot,
        controller,
    };
};
