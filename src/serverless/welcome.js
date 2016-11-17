import smoker from './services/smoker';
import botFactory from './services/botkit';
import welcomeMsg from './messages/welcome';

export default function* welcome(smokerData) {
    try {
        // @TODO use botkit console then slack/octopush
        const bot = botFactory();
        bot.send({ text: welcomeMsg(smokerData.name) });

        yield smoker.save({
            ...smokerData,
            state: 'welcomed',
        });

        setTimeout(() => {
            process.exit(0);
        }, 3000);
    } catch (error) {
        console.error(error);
        setTimeout(() => {
            process.exit(1);
        }, 3000);
    }
}
