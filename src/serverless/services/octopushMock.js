/* eslint camelcase: off, class-methods-use-this: off */
import octopush from 'octopush';
import uuid from 'uuid';

const sentSms = [];

class SMS {
    sms = {}

    uniqid() {
        return uuid();
    }

    set_sms_fields_1(value) {
        this.sms.sms_fields_1 = value;
    }

    set_sms_fields_2(value) {
        this.sms.sms_fields_2 = value;
    }

    set_sms_fields_3(value) {
        this.sms.sms_fields_3 = value;
    }

    set_simulation_mode() {}

    set_option_with_replies(value) {
        this.sms.with_replies = value;
    }

    set_option_transactional(value) {
        this.sms.transactional = value;
    }

    set_sms_text(value) {
        this.sms.text = value;
    }

    set_sms_recipients(value) {
        this.sms.recipients = value;
    }

    set_sms_type(value) {
        this.sms.type = value;
    }

    set_sms_mode(value) {
        this.sms.mode = value;
    }

    set_sms_sender(value) {
        this.sms.sender = value;
    }

    set_sms_request_id(value) {
        this.sms.request_id = value;
    }

    set_recipients_first_names(value) {
        this.sms.recipients_first_names = value;
    }

    set_recipients_last_names(value) {
        this.sms.recipients_last_names = value;
    }

    send(callback) {
        sentSms.push(this.sms);
        callback(null);
    }
}

export default {
    SMS,
    clear() {
        sentSms.splice(0, sentSms.length);
    },
    constants: octopush.constants,
    sentSms,
};
