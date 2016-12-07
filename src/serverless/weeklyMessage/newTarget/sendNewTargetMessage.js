import sendSms from '../../services/sendSms';

export const newTargetMessage = () => (
`One week has passed since I gave you the objective to smoke only {ch1} cigarettes.
In order to reach zero cigarettes in {ch2} weeks you must now smoke no more than {ch3} cigarettes at most today!`
);

export const sendNewTargetMessageFactory = send => ({ phones, remainingWeeks, oldTarget, newTarget }) =>
    send(phones, newTargetMessage(), oldTarget, remainingWeeks, newTarget);

export default sendNewTargetMessageFactory(sendSms);
