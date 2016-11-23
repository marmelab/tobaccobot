import sendSms from '../services/sendSms';
import welcomeMsg from '../messages/welcome';

export const sendWelcomeMessageFactory = send => (phone, smoker) =>
    send(phone, welcomeMsg(smoker.name));

export default sendWelcomeMessageFactory(sendSms);
