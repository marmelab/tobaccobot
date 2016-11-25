import expect, { createSpy } from 'expect';
import { sendDubiousMessageFactory } from './sendDubiousMessage';
import dubiousMessage from '../messages/dubious';

describe('sendDubiousMessage', () => {
    it('should send the dubious message using the bot', () => {
        const send = createSpy();

        sendDubiousMessageFactory(send)('phone');

        expect(send).toHaveBeenCalledWith('phone', dubiousMessage());
    });
});
