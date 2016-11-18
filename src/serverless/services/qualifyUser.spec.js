import expect from 'expect';

import qualifyUser from './qualifyUser';
import qualifiedMessage from '../messages/qualified';
import dubiousMessage from '../messages/dubious';

describe('qualifyUser', () => {
    const send = expect.createSpy();
    const save = expect.createSpy().andReturn(Promise.resolve(null));
    const bot = {
        send,
        controller: {
            storage: {
                users: {
                    save,
                },
            },
        },
    };

    it('should qualifyUser if message is a number', function* () {
        yield qualifyUser(bot, {
            name: 'john',
        }, { text: '13' });

        expect(send).toHaveBeenCalledWith({ text: qualifiedMessage(9) });
        expect(save).toHaveBeenCalledWith({
            name: 'john',
            state: 'qualified',
            targetConsumption: 9,
            remainingDays: 28,
        });
    });

    it('should set user state to dubious if message is not a number', function* () {
        yield qualifyUser(bot, {
            name: 'john',
        }, { text: 'I do not know' });

        expect(send).toHaveBeenCalledWith({ text: dubiousMessage() });
        expect(save).toHaveBeenCalledWith({
            name: 'john',
            state: 'dubious',
        });
    });

    afterEach(() => {
        send.reset();
        save.reset();
    });
});
