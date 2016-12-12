import sendSms from '../../services/sendSms';
import dubiousMessage from './dubious';

export const sendDubiousMessageFactory = send => (phone) => {
    send(phone, dubiousMessage());
};

export default sendDubiousMessageFactory(sendSms);
