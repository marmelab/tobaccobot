import botFactory from '../services/botkit';
import qualifiedMessage from '../messages/qualified';

export const sendQualifiedMessageFactory = bot => (targetConsumption) => {
    bot.send({ text: qualifiedMessage(targetConsumption) });
};

export default sendQualifiedMessageFactory(botFactory());
