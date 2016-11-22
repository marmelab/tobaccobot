import expect, { createSpy } from 'expect';
import { sendQualifiedMessageFactory } from './sendQualifiedMessage';
import qualifiedMessage from '../messages/qualified';

describe('sendQualifiedMessage', () => {
    it('should send the qualified message using the bot', () => {
        const bot = {
            send: createSpy(),
        };
        const targetConsumption = 42;

        sendQualifiedMessageFactory(bot)(targetConsumption);

        expect(bot.send).toHaveBeenCalledWith({ text: qualifiedMessage(targetConsumption) });
    });
});
