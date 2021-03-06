import sendSms from '../services/sendSms';
import welcomeMsg from './welcome';

export const sendWelcomeMessageFactory = send => (phone, name) =>
    send(phone, welcomeMsg(name));

export default sendWelcomeMessageFactory(sendSms);
