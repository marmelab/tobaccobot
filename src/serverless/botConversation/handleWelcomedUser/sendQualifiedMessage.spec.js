import expect, { createSpy } from 'expect';
import { sendQualifiedMessageFactory } from './sendQualifiedMessage';
import qualifiedMessage from './qualified';

describe('sendQualifiedMessage', () => {
    it('should send the qualified message using the bot', () => {
        const send = createSpy();
        const targetConsumption = 42;

        sendQualifiedMessageFactory(send)('phone', targetConsumption);

        expect(send).toHaveBeenCalledWith('phone', qualifiedMessage(targetConsumption));
    });
});
