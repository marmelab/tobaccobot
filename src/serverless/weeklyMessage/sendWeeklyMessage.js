import sendSms from '../services/sendSms';
import weeklyMessage from './weeklyMessage';

export const sendDailyEvaluationMessageFactory = send => ({ phones, remainingWeeks, oldTarget, newTarget }) =>
    send(phones, weeklyMessage(), oldTarget, remainingWeeks, newTarget);

export default sendDailyEvaluationMessageFactory(sendSms);
