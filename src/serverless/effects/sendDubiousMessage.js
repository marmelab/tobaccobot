import botFactory from '../services/botkit';
import dubiousMessage from '../messages/dubious';

export const sendDubiousMessageFactory = bot => () => {
    bot.send({ text: dubiousMessage() });
};

export default function () {
    sendDubiousMessageFactory(botFactory());
}
