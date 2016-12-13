import config from 'config';
import sendSms from '../../../services/sendSms';

export const successMessage = () => (
`Wow, you have'nt smoked a cigarette in the past three days.
I think we can agree that you have succeeded.
Congratulations, I'm proud of you!
And from now on, you're on your own - I won't bother you again.
You can see a chart about your progress at: {ch1}.
It's been a pleasure to coach you! Cheers.`
);

export const sendSuccessMessageFactory = send => (phones) => {
    if (!phones || !phones.length) {
        return;
    }
    send(phones, successMessage(), phones.map(phone => `${config.reportLink}?phone=${encodeURIComponent(phone)}`));
};

export default sendSuccessMessageFactory(sendSms);
