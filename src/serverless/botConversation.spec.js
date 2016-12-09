import expect from 'expect';
import omit from 'lodash.omit';

import dynamoDB from './services/dynamoDB';
import botConversationLambda, { botConversation } from './botConversation';
import { setupSmokerTable } from './setupSmokerTable';
import octopushMock from './services/octopushMock';

import qualifiedMessage from './botConversation/handleWelcomedUser/qualified';
import {
    backFromBad,
    backFromBadCombo,
    backFromReallyBad,
    bad,
    badCombo,
    badComboLinks,
    continuedGreatProgress,
    greatProgress,
    good,
    goodCombo,
    reallyBad,
    reallyGood,
} from './botConversation/handleAskedUser/dailyEvaluation';
import stopMessage from './botConversation/handleStopUser/stop';
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
            describe('bad', () => {
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
                            consumption: 15,
                            state: 'good',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '16';
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
                            consumption: 15,
                            state: 'good',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 16,
                            state: 'bad',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: bad(15),
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

            describe('reallyBad', () => {
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
                            consumption: 17,
                            state: 'bad',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '16';
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
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 16,
                            state: 'bad',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: reallyBad(),
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

            describe('badCombo', () => {
                before(function* () {
                    yield setupSmokerTable();

                    yield dynamoDB.putItem('smoker', {
                        name: 'john',
                        phone: '+33614786356',
                        remainingDays: 25,
                        state: 'asked',
                        week: 1,
                        targetConsumption: computeTargetConsumption(20),
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '16';
                    const number = '+33614786356';

                    yield botConversation({ text, number });
                    const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                    const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                    expect(Item).toEqual({
                        name: 'john',
                        phone: '+33614786356',
                        state: 'qualified',
                        remainingDays: 25,
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 3,
                            week: 1,
                            consumption: 16,
                            state: 'bad',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: badCombo(3, 15, badComboLinks[0]),
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

            describe('backFromBad', () => {
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
                            consumption: 17,
                            state: 'bad',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '14';
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
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 14,
                            state: 'good',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: backFromBad(),
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

            describe('backFromReallyBad', () => {
                before(function* () {
                    yield setupSmokerTable();

                    yield dynamoDB.putItem('smoker', {
                        name: 'john',
                        phone: '+33614786356',
                        remainingDays: 25,
                        state: 'asked',
                        week: 1,
                        targetConsumption: computeTargetConsumption(20),
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '14';
                    const number = '+33614786356';

                    yield botConversation({ text, number });
                    const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                    const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                    expect(Item).toEqual({
                        name: 'john',
                        phone: '+33614786356',
                        state: 'qualified',
                        remainingDays: 25,
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 3,
                            week: 1,
                            consumption: 14,
                            state: 'good',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: backFromReallyBad(15),
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

            describe('backFromBadCombo', () => {
                before(function* () {
                    yield setupSmokerTable();

                    yield dynamoDB.putItem('smoker', {
                        name: 'john',
                        phone: '+33614786356',
                        remainingDays: 24,
                        state: 'asked',
                        week: 1,
                        targetConsumption: computeTargetConsumption(20),
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 3,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '14';
                    const number = '+33614786356';

                    yield botConversation({ text, number });
                    const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                    const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                    expect(Item).toEqual({
                        name: 'john',
                        phone: '+33614786356',
                        state: 'qualified',
                        remainingDays: 24,
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 3,
                            week: 1,
                            consumption: 17,
                            state: 'bad',
                        }, {
                            day: 4,
                            week: 1,
                            consumption: 14,
                            state: 'good',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: backFromBadCombo(),
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

            describe('good', () => {
                before(function* () {
                    yield setupSmokerTable();

                    yield dynamoDB.putItem('smoker', {
                        name: 'john',
                        phone: '+33614786356',
                        remainingDays: 27,
                        state: 'asked',
                        week: 1,
                        targetConsumption: computeTargetConsumption(20),
                        history: [],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '15';
                    const number = '+33614786356';

                    yield botConversation({ text, number });
                    const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                    const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                    expect(Item).toEqual({
                        name: 'john',
                        phone: '+33614786356',
                        state: 'qualified',
                        remainingDays: 27,
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 15,
                            state: 'good',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: good(15),
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

            describe('greatProgress', () => {
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
                            consumption: 15,
                            state: 'good',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '10';
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
                            consumption: 15,
                            state: 'good',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 10,
                            state: 'good',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: greatProgress(5),
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

            describe('continuedGreatProgress', () => {
                before(function* () {
                    yield setupSmokerTable();

                    yield dynamoDB.putItem('smoker', {
                        name: 'john',
                        phone: '+33614786356',
                        remainingDays: 25,
                        state: 'asked',
                        week: 1,
                        targetConsumption: computeTargetConsumption(20),
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 15,
                            state: 'good',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 10,
                            state: 'good',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '6';
                    const number = '+33614786356';

                    yield botConversation({ text, number });
                    const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                    const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                    expect(Item).toEqual({
                        name: 'john',
                        phone: '+33614786356',
                        state: 'qualified',
                        remainingDays: 25,
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 15,
                            state: 'good',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 10,
                            state: 'good',
                        }, {
                            day: 3,
                            week: 1,
                            consumption: 6,
                            state: 'good',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: continuedGreatProgress(4),
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

            describe('reallyGood', () => {
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
                            consumption: 15,
                            state: 'good',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '14';
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
                            consumption: 15,
                            state: 'good',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 14,
                            state: 'good',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: reallyGood(),
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

            describe('goodCombo', () => {
                before(function* () {
                    yield setupSmokerTable();

                    yield dynamoDB.putItem('smoker', {
                        name: 'john',
                        phone: '+33614786356',
                        remainingDays: 25,
                        state: 'asked',
                        week: 1,
                        targetConsumption: computeTargetConsumption(20),
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 15,
                            state: 'good',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 14,
                            state: 'good',
                        }],
                    });
                });

                it('should update the user and notify him about its objective', function* () {
                    const text = '13';
                    const number = '+33614786356';

                    yield botConversation({ text, number });
                    const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                    const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                    expect(Item).toEqual({
                        name: 'john',
                        phone: '+33614786356',
                        state: 'qualified',
                        remainingDays: 25,
                        history: [{
                            day: 1,
                            week: 1,
                            consumption: 15,
                            state: 'good',
                        }, {
                            day: 2,
                            week: 1,
                            consumption: 14,
                            state: 'good',
                        }, {
                            day: 3,
                            week: 1,
                            consumption: 13,
                            state: 'good',
                        }],
                        targetConsumption: computeTargetConsumption(20),
                        week: 1,
                    });

                    expect(omit(sms, 'request_id')).toEqual({
                        with_replies: 1,
                        transactional: 1,
                        text: goodCombo(3),
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

        describe('user want to stop', () => {
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

            it('should update the user and notify him about the program being stopped', function* () {
                const text = '20';
                const number = '+33614786356';

                yield botConversation({ text, number, stop_date: 'today' });
                const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === number));

                const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

                expect(Item).toEqual({
                    name: 'john',
                    phone: '+33614786356',
                    remainingDays: 26,
                    state: 'stopped',
                    week: 1,
                    targetConsumption: computeTargetConsumption(20),
                    history: [{
                        day: 1,
                        week: 1,
                        consumption: 20,
                        state: 'bad',
                    }],
                });

                expect(omit(sms, 'request_id')).toEqual({
                    with_replies: 1,
                    transactional: 1,
                    text: stopMessage(),
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
