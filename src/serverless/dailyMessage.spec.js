import expect from 'expect';
import omit from 'lodash.omit';

import octopushMock from './services/octopushMock';
import dynamoDB from './services/dynamoDB';
import dailyMessage from './dailyMessage';
import { setupTables } from './setupTables';
import computeTargetConsumption from './botConversation/handleWelcomedUser/computeTargetConsumption';
import askDaily from './dailyMessage/askDaily';
import askDubious from './dailyMessage/askDubious';

describe('dailyMessage', () => {
    describe('dailyMessage lambda', () => {
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
});
