import botFactory from '../services/botkit';
import welcomeMsg from '../messages/welcome';

export default function (smoker) {
    const bot = botFactory();
    bot.send({ text: welcomeMsg(smoker.name) });
}
