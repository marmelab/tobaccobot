import expect, { createSpy } from 'expect';
import { sendWelcomeMessageFactory } from './sendWelcomeMessage';
import welcomeMsg from './welcome';

describe('sendWelcomeMessage', () => {
    it('should send the welcome message using the bot', () => {
        const send = createSpy();

        const name = 'Frodo';
        const phone = '0123456789';

        sendWelcomeMessageFactory(send)(phone, name);

        expect(send).toHaveBeenCalledWith(phone, welcomeMsg(name));
    });
});
