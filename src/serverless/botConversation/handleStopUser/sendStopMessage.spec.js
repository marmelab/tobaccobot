import expect, { createSpy } from 'expect';
import { sendStopMessageFactory } from './sendStopMessage';
import stopMessage from './stop';

describe('sendStopMessage', () => {
    it('should send the stop message using the bot', () => {
        const send = createSpy();

        sendStopMessageFactory(send)('phone');

        expect(send).toHaveBeenCalledWith('phone', stopMessage());
    });
});
