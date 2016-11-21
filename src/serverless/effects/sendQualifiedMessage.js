import botFactory from '../services/botkit';
import qualifiedMessage from '../messages/qualified';

export default function (targetConsumption) {
    const bot = botFactory();
    bot.send({ text: qualifiedMessage(targetConsumption) });
}
