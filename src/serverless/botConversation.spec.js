import expect from 'expect';
import omit from 'lodash.omit';

import dynamoDB from './services/dynamoDB';
import botConversationLambda, { botConversation } from './botConversation';
import { setupSmokerTable } from './setupSmokerTable';
import octopushMock from './services/octopushMock';

import qualifiedMessage from './botConversation/handleWelcomedUser/qualified';
import dailyEvaluation from './botConversation/handleAskedUser/dailyEvaluation';
import computeTargetConsumption from './botConversation/handleWelcomedUser/computeTargetConsumption';

describe('botConversation', () => {
    describe('botConversation lambda', () => {
        before(function* () {
            yield setupSmokerTable();
        });

        it('should return 200 with valid number of cigarettes', function* () {
            const result = yield cb => botConversationLambda({ message: '42', number: '+33614786356' }, null, cb);
            expect(result).toBe('');
        });

        it('should return 200 with invalid number of cigarettes', function* () {
            const result = yield cb => botConversationLambda({ message: 'foo', number: '+33614786356' }, null, cb);
            expect(result).toBe('');
        });

        after(function* () {
            yield dynamoDB.deleteTable({
                TableName: 'smoker',
            });
        });
    });


    describe('e2e', () => {
        describe('welcomed user', () => {
            before(function* () {
                yield setupSmokerTable();

                yield dynamoDB.putItem('smoker', {
                    name: 'john',
                    phone: '+33614786356',
                    state: 'welcomed',
                });
            });

            it('should update the user and notify him about its objective', function* () {
                const text = '20';
                const number = '+33614786356';
                const targetConsumption = computeTargetConsumption(20);

                yield botConversation({ text, number });
                const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                expect(Item).toEqual({
                    name: 'john',
                    phone: '+33614786356',
                    state: 'qualified',
                    remainingDays: 28,
                    week: 1,
                    targetConsumption,
                });

                expect(omit(sms, 'request_id')).toEqual({
                    with_replies: 1,
                    transactional: 1,
                    text: qualifiedMessage(targetConsumption[1]),
                    recipients: [number],
                    type: octopushMock.constants.SMS_PREMIUM,
                    mode: octopushMock.constants.INSTANTANE,
                    sender: 'tobaccobot',
                });
            });

            after(function* () {
                yield dynamoDB.deleteTable({
                    TableName: 'smoker',
                });

                octopushMock.clear();
            });
        });

        describe('asked user', () => {
            before(function* () {
                yield setupSmokerTable();

                yield dynamoDB.putItem('smoker', {
                    name: 'john',
                    phone: '+33614786356',
                    remainingDays: 26,
                    state: 'asked',
                    week: 1,
                    targetConsumption: computeTargetConsumption(20),
                    history: [{
                        day: 1,
                        week: 1,
                        consumption: 20,
                        state: 'bad',
                    }],
                });
            });

            it('should update the user and notify him about its objective', function* () {
                const text = '20';
                const number = '+33614786356';

                yield botConversation({ text, number });
                const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                expect(Item).toEqual({
                    name: 'john',
                    phone: '+33614786356',
                    state: 'qualified',
                    remainingDays: 26,
                    history: [{
                        day: 1,
                        week: 1,
                        consumption: 20,
                        state: 'bad',
                    }, {
                        day: 2,
                        week: 1,
                        consumption: 20,
                        state: 'bad',
                    }],
                    targetConsumption: computeTargetConsumption(20),
                    week: 1,
                });

                expect(omit(sms, 'request_id')).toEqual({
                    with_replies: 1,
                    transactional: 1,
                    text: dailyEvaluation({ state: 'bad', delta: [], combo: { hit: 2, repeatition: 1 } }),
                    recipients: [number],
                    type: octopushMock.constants.SMS_PREMIUM,
                    mode: octopushMock.constants.INSTANTANE,
                    sender: 'tobaccobot',
                });
            });

            after(function* () {
                yield dynamoDB.deleteTable({
                    TableName: 'smoker',
                });

                octopushMock.clear();
            });
        });
    });
});
