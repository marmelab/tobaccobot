import sendSms from '../services/sendSms';
import dubiousMessage from '../messages/dubious';

export const sendDubiousMessageFactory = send => phone =>
    send(phone, dubiousMessage());

export default sendDubiousMessageFactory(sendSms);
