import sendSms from '../../services/sendSms';
import stopMessage from './stop';

export const sendStopMessageFactory = send => (phone) => {
    send(phone, stopMessage());
};

export default sendStopMessageFactory(sendSms);
