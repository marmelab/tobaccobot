import expect, { createSpy } from 'expect';
import { sendDubiousMessageFactory } from './sendDubiousMessage';
import dubiousMessage from '../messages/dubious';

describe('sendDubiousMessage', () => {
    it('should send the dubious message using the bot', () => {
        const bot = {
            send: createSpy(),
        };

        sendDubiousMessageFactory(bot)();

        expect(bot.send).toHaveBeenCalledWith({ text: dubiousMessage() });
    });
});
