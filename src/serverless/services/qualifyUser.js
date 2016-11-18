import dubiousMessage from '../messages/dubious';
import qualifiedMessage from '../messages/qualified';
import smoker from './smoker';

const computeTargetConsumption = nbCigarettes =>
    Math.floor(nbCigarettes / 4) * 3;

export default function* qualifyUser(bot, user, message) {
    const nbCigarettes = parseInt(message.text, 10);
    if (isNaN(nbCigarettes)) {
        yield smoker.save({
            ...user,
            state: 'dubious',
        });
        bot.send({ text: dubiousMessage() });
        return;
    }
    const targetConsumption = computeTargetConsumption(nbCigarettes);

    yield smoker.save({
        ...user,
        state: 'qualified',
        targetConsumption,
        remainingDays: 28,
    });
    bot.send({ text: qualifiedMessage(targetConsumption) });
}
