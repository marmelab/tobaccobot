import botkit from 'botkit';

import dynamoDBStorage from './dynamoDBStorage';

export const console = botkit.consolebot({
    debug: false,
    storage: dynamoDBStorage,
});
