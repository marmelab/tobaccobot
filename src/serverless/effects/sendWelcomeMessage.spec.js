import expect, { createSpy } from 'expect';
import { sendWelcomeMessageFactory } from './sendWelcomeMessage';
import welcomeMsg from '../messages/welcome';

describe('sendWelcomeMessage', () => {
    it('should send the welcome message using the bot', () => {
        const bot = {
            send: createSpy(),
        };

        const smoker = {
            name: 'Frodo',
        };

        sendWelcomeMessageFactory(bot)(smoker);

        expect(bot.send).toHaveBeenCalledWith({ text: welcomeMsg(smoker.name) });
    });
});
