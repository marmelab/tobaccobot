import sendSms from '../services/sendSms';
import dailyEvaluationMessage from '../messages/dailyEvaluation';

export const sendDailyEvaluationMessageFactory = send => (phone, evaluation) => {
    send(phone, dailyEvaluationMessage(evaluation));
};

export default sendDailyEvaluationMessageFactory(sendSms);
