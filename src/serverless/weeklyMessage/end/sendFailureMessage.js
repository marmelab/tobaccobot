import sendSms from '../../services/sendSms';

export const failureMessage = () => (
`Ok, I've done my best for the past 28 days, but it's not only in my hands -
YOU are the one who can stop smoking.
We'll stop this for now, but I'm confident that you can try another time.
We'll keep in touch!`
);

export const sendFailureMessageFactory = send => phones =>
    send(phones, failureMessage());

export default sendFailureMessageFactory(sendSms);
