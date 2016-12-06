import expect from 'expect';
import omit from 'lodash.omit';

import weeklyMessage from './weeklyMessage';
import smoker from './services/smoker';
import { setupSmokerTable } from './setupSmokerTable';
import octopushMock from './services/octopushMock';
import { successMessage } from './weeklyMessage/end/sendSuccessMessage';
import { failureMessage } from './weeklyMessage/end/sendFailureMessage';
import { newTargetMessage } from './weeklyMessage/newTarget/sendNewTargetMessage';

describe('e2e weeklyMessage', () => {
    let successfulUser;
    let failedUser;
    let endOfWeekUser;
    let ignoredUser;
    before(function* () {
        yield setupSmokerTable();
        successfulUser = {
            name: 'successfulUser',
            phone: '+33111111111',
            state: 'qualified',
            remainingDays: 0,
            week: 4,
            targetConsumption: {
                1: 15,
                2: 10,
                3: 5,
                4: 0,
            },
            history: [
                { consumption: 0, state: 'good' },
                { consumption: 0, state: 'good' },
                { consumption: 0, state: 'good' },
            ],
        };
        failedUser = {
            name: 'failedUser',
            phone: '+33222222222',
            state: 'qualified',
            remainingDays: 0,
            week: 4,
            targetConsumption: {
                1: 15,
                2: 10,
                3: 5,
                4: 0,
            },
            history: [
                { consumption: 0, state: 'good' },
                { consumption: 1, state: 'bad' },
                { consumption: 0, state: 'good' },
            ],
        };
        endOfWeekUser = {
            name: 'endOfWeekUser',
            phone: '+33333333333',
            state: 'qualified',
            remainingDays: 7,
            week: 3,
            targetConsumption: {
                1: 6,
                2: 4,
                3: 2,
                4: 0,
            },
            history: [
                { consumption: 0, state: 'good' },
                { consumption: 1, state: 'bad' },
                { consumption: 0, state: 'good' },
            ],
        };
        ignoredUser = {
            name: 'ignoredUser',
            phone: '+33444444444',
            state: 'qualified',
            remainingDays: 9,
            week: 3,
            targetConsumption: {
                1: 9,
                2: 6,
                3: 3,
                4: 0,
            },
            history: [
                { consumption: 0, state: 'good' },
                { consumption: 1, state: 'bad' },
                { consumption: 0, state: 'good' },
            ],
        };
        yield [
            successfulUser,
            failedUser,
            endOfWeekUser,
            ignoredUser,
        ].map(smoker.save);

        yield cb => weeklyMessage(null, null, cb);
    });

    it('should have deleted smoker successfulUser', function* () {
        const user = yield smoker.get(successfulUser.phone);
        expect(user).toEqual({});
    });

    it('should have deleted smoker failedUser', function* () {
        const user = yield smoker.get(failedUser.phone);
        expect(user).toEqual({});
    });

    it('should have incremented week of smoker endOfWeekUser by 1', function* () {
        const user = yield smoker.get(endOfWeekUser.phone);
        expect(user).toEqual({
            ...endOfWeekUser,
            week: 4,
        });
    });

    it('should have left ignoredUser smoker as is', function* () {
        const user = yield smoker.get(ignoredUser.phone);
        expect(user).toEqual(ignoredUser);
    });

    it('should have sent success message to successfulUser', () => {
        const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === successfulUser.phone));

        expect(omit(sms, 'request_id')).toEqual({
            with_replies: 1,
            transactional: 1,
            text: successMessage(),
            recipients: [successfulUser.phone],
            type: octopushMock.constants.SMS_PREMIUM,
            mode: octopushMock.constants.INSTANTANE,
            sender: 'tobaccobot',
        });
    });

    it('should have sent failure message to failedUser', () => {
        const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === failedUser.phone));

        expect(omit(sms, 'request_id')).toEqual({
            with_replies: 1,
            transactional: 1,
            text: failureMessage(),
            recipients: [failedUser.phone],
            type: octopushMock.constants.SMS_PREMIUM,
            mode: octopushMock.constants.INSTANTANE,
            sender: 'tobaccobot',
        });
    });

    it('should have sent newTargetMessage to endOfWeekUser', () => {
        const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === endOfWeekUser.phone));

        expect(omit(sms, 'request_id')).toEqual({
            with_replies: 1,
            transactional: 1,
            text: newTargetMessage(),
            recipients: [endOfWeekUser.phone],
            type: octopushMock.constants.SMS_PREMIUM,
            mode: octopushMock.constants.INSTANTANE,
            sms_fields_1: [4],
            sms_fields_2: [2],
            sms_fields_3: [2],
            sender: 'tobaccobot',
        });
    });
});
