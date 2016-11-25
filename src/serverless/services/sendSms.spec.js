import expect from 'expect';
import { sendSmsFactory } from './sendSms';

describe('sendSms', () => {
    let smsData = {};
    let sendError;
    let sendResult;
    const sms = {
        set_simulation_mode() {},
        uniqid() {
            return 'uniqid';
        },
        set_option_with_replies(data) {
            smsData.option_with_replies = data;
        },
        set_option_transactional(data) {
            smsData.option_transactional = data;
        },
        set_sms_text(data) {
            smsData.sms_text = data;
        },
        set_sms_recipients(data) {
            smsData.sms_recipients = data;
        },
        set_sms_type(data) {
            smsData.sms_type = data;
        },
        set_sms_mode(data) {
            smsData.sms_mode = data;
        },
        set_sms_sender(data) {
            smsData.sms_sender = data;
        },
        set_sms_request_id(data) {
            smsData.sms_request_id = data;
        },
        send(cb) {
            cb(sendError, sendResult);
        },
    };
    let octoPushCall;
    const octopush = {
        SMS(userId, apiKey) {
            octoPushCall = { userId, apiKey };
            return sms;
        },
        constants: {
            SMS_PREMIUM: 'SMS_PREMIUM',
            INSTANTANE: 'INSTANTANE',
        },
    };
    const sendSms = sendSmsFactory(octopush);

    beforeEach(() => {
        smsData = {};
        octoPushCall = null;
        sendError = null;
        sendResult = {
            send: 'result',
        };
        octoPushCall = null;
    });

    it('should configure sms before calling send', function* () {
        const result = yield sendSms('phone_number', 'message text');
        expect(result).toEqual({
            ...sendResult,
            message: 'message text',
        });
        expect(octoPushCall).toEqual({
            userId: 'login',
            apiKey: 'apikey',
        });
        expect(smsData).toEqual({
            option_transactional: 1,
            option_with_replies: 1,
            sms_mode: 'INSTANTANE',
            sms_recipients: ['phone_number'],
            sms_request_id: 'uniqid',
            sms_sender: 'tobaccobot',
            sms_text: 'message text',
            sms_type: 'SMS_PREMIUM',
        });
    });

    it('should reject with new Error(result) if sendError is not null', (done) => {
        sendError = true;
        sendResult = 'error message';
        sendSms('phone_number', 'message text')
        .then(() => {
            done(new Error('sendSms promise should have been rejected'));
        })
        .catch((error) => {
            expect(error.message).toBe('error message');
            done();
        })
        .catch(done);
    });
});
