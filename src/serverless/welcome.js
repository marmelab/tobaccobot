import smoker from './services/smoker';
import { consoleController } from './services/botkit';

const welcomeMsg = name => (
`Hi ${name}, and thanks for joining the tobaccobot program!
During the next 4 weeks, I'll text you every morning to ask about your cigarette consumption of the day before.
Just reply with the number and I'll do my best to help you quit smoking!
And to begin with, how many cigarettes did you smoke yesterday ?`
);

export default function* welcome(smokerData) {
    // @TODO use botkit console then slack/octopush
    const bot = consoleController.spawn();
    bot.send({ text: welcomeMsg(smokerData.name) });
    yield smoker.save({
        ...smokerData,
        state: 'welcomed',
    });
}
