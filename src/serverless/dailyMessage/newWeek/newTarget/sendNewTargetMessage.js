import sendSms from '../../../services/sendSms';

// As octopush can only use 3 parameters (ch1, ch2, ch3), we use the {prenom} parameter as a 4th one
export const newTargetMessage = () => (
`One week has passed since I gave you the objective to smoke only {ch1} cigarettes.
You can see a chart about your progress at: {prenom}.
In order to reach zero cigarettes in {ch2} weeks you must now smoke no more than {ch3} cigarettes at most today!
Can you tell me how many cigarettes you smoke yesterday?`
);

export const sendNewTargetMessageFactory = send => ({ phones, remainingWeeks, reportLink, oldTarget, newTarget }) =>
    send(phones, newTargetMessage(), oldTarget, remainingWeeks, newTarget, reportLink);

export default sendNewTargetMessageFactory(sendSms);
