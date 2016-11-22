import botFactory from '../services/botkit';
import welcomeMsg from '../messages/welcome';

export const sendWelcomeMessageFactory = bot => (smoker) => {
    bot.send({ text: welcomeMsg(smoker.name) });
};

export default function () {
    sendWelcomeMessageFactory(botFactory());
}
