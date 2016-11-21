import botFactory from '../services/botkit';
import dubiousMessage from '../messages/dubious';

export default function () {
    const bot = botFactory();
    bot.send({ text: dubiousMessage() });
}
