import expect from 'expect';
import omit from 'lodash.omit';

import octopushMock from './services/octopushMock';
import dynamoDB from './services/dynamoDB';
import { setupTables } from './setupTables';

import dailyMessage from './dailyMessage';
import computeTargetConsumption from './botConversation/handleWelcomedUser/computeTargetConsumption';
import askDaily from './dailyMessage/newDay/askDaily';
import askDubious from './dailyMessage/newDay/askDubious';

import archive from './services/archive';
import smoker from './services/smoker';
import { successMessage } from './dailyMessage/newWeek/end/sendSuccessMessage';
import { failureMessage } from './dailyMessage/newWeek/end/sendFailureMessage';
import { newTargetMessage } from './dailyMessage/newWeek/newTarget/sendNewTargetMessage';

describe('dailyMessage', () => {
    describe('for users starting a new day', () => {
        before(function* () {
            yield setupTables();

            yield dynamoDB.putItem('smoker', {
                name: 'dude',
                phone: '+33614786356',
                remainingDays: 26,
                state: 'qualified',
                week: 1,
                targetConsumption: computeTargetConsumption(20),
                history: [
                    {
                        day: 1,
                        week: 1,
                        consumption: 20,
                        state: 'bad',
                    },
                ],
            });

            yield dynamoDB.putItem('smoker', {
                name: 'dude',
                phone: '+33614786357',
                remainingDays: 26,
                state: 'qualified',
                week: 1,
                targetConsumption: computeTargetConsumption(20),
                history: [
                    {
                        day: 1,
                        week: 1,
                        consumption: 15,
                        state: 'good',
                    },
                ],
            });

            yield dynamoDB.putItem('smoker', {
                name: 'dude',
                phone: '+33614786358',
                remainingDays: 26,
                state: 'dubious',
                week: 1,
            });

            yield dynamoDB.putItem('smoker', {
                name: 'dude',
                phone: '+33614786359',
                remainingDays: 26,
                state: 'dubious',
                week: 1,
            });

            yield dynamoDB.putItem('smoker', {
                name: 'dude',
                phone: '+33614786310',
                remainingDays: 26,
                state: 'asked',
                week: 1,
            });
        });

        it('should send sms asking for today consumption to all qualified and asked users', (done) => {
            dailyMessage(null, null, (error) => {
                if (error) return done(error);

                try {
                    const sms = octopushMock.sentSms.find(({ recipients }) => recipients.includes('+33614786356'));
                    expect(sms.recipients).toInclude('+33614786356');
                    expect(sms.recipients).toInclude('+33614786357');
                    expect(sms.recipients).toInclude('+33614786310');
                    expect(omit(sms, ['request_id', 'recipients'])).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: askDaily(),
                        type: octopushMock.constants.SMS_PREMIUM,
                        mode: octopushMock.constants.INSTANTANE,
                        sender: 'tobaccobot',
                    });

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it('should send sms asking for yesterday consuption to all dubious users', (done) => {
            dailyMessage(null, null, (error) => {
                if (error) return done(error);

                try {
                    const sms = octopushMock.sentSms.find(({ recipients }) => recipients.includes('+33614786358'));
                    expect(sms.recipients).toInclude('+33614786358');
                    expect(sms.recipients).toInclude('+33614786359');

                    expect(omit(sms, ['request_id', 'recipients'])).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: askDubious(),
                        type: octopushMock.constants.SMS_PREMIUM,
                        mode: octopushMock.constants.INSTANTANE,
                        sender: 'tobaccobot',
                    });

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        after(function* () {
            yield dynamoDB.deleteTable({ TableName: 'smoker' });
            octopushMock.clear();
        });
    });

    describe('for user starting a new week', () => {
        let successfulUser;
        let failedUser;
        let endOfWeekUser;

        before(function* () {
            yield setupTables();
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
            yield [
                successfulUser,
                failedUser,
                endOfWeekUser,
            ].map(smoker.save);

            yield cb => dailyMessage(null, null, cb);
        });

        it('should have deleted smoker successfulUser', function* () {
            const user = yield smoker.get(successfulUser.phone);
            expect(user).toEqual(null);
        });

        it('should have deleted smoker failedUser', function* () {
            const user = yield smoker.get(failedUser.phone);
            expect(user).toEqual(null);
        });

        it('should have archived smoker successfulUser', function* () {
            const users = yield archive.all(10);
            expect(users.items.find(u => u.name === successfulUser.name)).toExist();
        });

        it('should have archived smoker failedUser', function* () {
            const users = yield archive.all(10);
            expect(users.items.find(u => u.name === failedUser.name)).toExist();
        });

        it('should have incremented week of smoker endOfWeekUser by 1 and decremented remainingDays by 1', function* () {
            const user = yield smoker.get(endOfWeekUser.phone);
            expect(user).toEqual({
                ...endOfWeekUser,
                week: 4,
                remainingDays: 6,
            });
        });

        it('should have sent success message to successfulUser', function* () {
            const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === successfulUser.phone));
            const users = yield archive.all(10);
            const user = users.items.find(u => u.name === successfulUser.name);

            expect(omit(sms, 'request_id')).toEqual({
                with_replies: 1,
                transactional: 1,
                text: successMessage(),
                recipients: [successfulUser.phone],
                type: octopushMock.constants.SMS_PREMIUM,
                mode: octopushMock.constants.INSTANTANE,
                sender: 'tobaccobot',
                sms_fields_1: [
                    `http://report?id=${user.id}`,
                ],
            });
        });

        it('should have sent failure message to failedUser', function* () {
            const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === failedUser.phone));
            const users = yield archive.all(10);
            const user = users.items.find(u => u.name === failedUser.name);

            expect(omit(sms, 'request_id')).toEqual({
                with_replies: 1,
                transactional: 1,
                text: failureMessage(),
                recipients: [failedUser.phone],
                type: octopushMock.constants.SMS_PREMIUM,
                mode: octopushMock.constants.INSTANTANE,
                sender: 'tobaccobot',
                sms_fields_1: [
                    `http://report?id=${user.id}`,
                ],
            });
        });

        it('should have sent newTargetMessage to endOfWeekUser', () => {
            const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === endOfWeekUser.phone));

            expect(omit(sms, 'request_id')).toEqual({
                with_replies: 1,
                transactional: 1,
                text: newTargetMessage(),
                recipients: [endOfWeekUser.phone],
                recipients_first_names: [`http://report?phone=${encodeURIComponent(endOfWeekUser.phone)}`],
                type: octopushMock.constants.SMS_PREMIUM,
                mode: octopushMock.constants.INSTANTANE,
                sms_fields_1: [2],
                sms_fields_2: [1],
                sms_fields_3: [0],
                sender: 'tobaccobot',
            });
        });

        after(function* () {
            yield dynamoDB.deleteTable({ TableName: 'smoker' });
            yield dynamoDB.deleteTable({ TableName: 'archive' });
            octopushMock.clear();
        });
    });
});
