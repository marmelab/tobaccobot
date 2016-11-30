import octopush from 'octopush';
import config from 'config';
import octopushMock from './octopushMock';

export const sendSmsFactory = octopushImpl => (phone, message, ch1, ch2, ch3) =>
    new Promise((resolve, reject) => {
        try {
            const sms = new octopushImpl.SMS(config.octopush.user_login, config.octopush.api_key);
            if (config.octopush.simutation) {
                sms.set_simulation_mode();
            }

            sms.set_option_with_replies(1);
            sms.set_option_transactional(1);
            sms.set_sms_text(message);
            sms.set_sms_recipients([phone]);
            sms.set_sms_type(octopushImpl.constants.SMS_PREMIUM);
            sms.set_sms_mode(octopushImpl.constants.INSTANTANE);
            sms.set_sms_sender('tobaccobot');
            sms.set_sms_request_id(sms.uniqid());

            if (ch1) {
                sms.set_sms_fields_1(ch1);
            }
            if (ch2) {
                sms.set_sms_fields_2(ch2);
            }
            if (ch3) {
                sms.set_sms_fields_3(ch3);
            }

            sms.send((error, result) => {
                if (error) {
                    return reject(new Error(result));
                }
                return resolve({
                    ...result,
                    message,
                });
            });
        } catch (error) {
            reject(error);
        }
    });

export default config.octopush.disabled ? sendSmsFactory(octopushMock) : sendSmsFactory(octopush);
