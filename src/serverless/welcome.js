import botFactory from './services/botkit';
import welcomeMsg from './messages/welcome';
import exit from './services/exit';

export default function* welcome(smokerData) {
    try {
        // @TODO use botkit console then slack/octopush
        const bot = botFactory();
        bot.send({ text: welcomeMsg(smokerData.name) });

        yield bot.controller.storage.users.save({
            ...smokerData,
            state: 'welcomed',
        });

        exit(0);
    } catch (error) {
        console.error(error);
        exit(1);
    }
}
