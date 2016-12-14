import config from 'config';
import sendSms from '../../../services/sendSms';

export const failureMessage = () => (
`Ok, I've done my best for the past 28 days, but it's not only in my hands -
YOU are the one who can stop smoking.
We'll stop this for now, but I'm confident that you can try another time.
You can see a chart about your progress at: {ch1}.
We'll keep in touch!`
);

export const sendFailureMessageFactory = send => (users) => {
    if (!users || !users.length) {
        return;
    }
    send(users.map(u => u.phone), failureMessage(), users.map(u => `${config.reportLink}?id=${encodeURIComponent(u.id)}`));
};

export default sendFailureMessageFactory(sendSms);
