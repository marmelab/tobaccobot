import expect from 'expect';
import { call } from 'sg.js';
import omit from 'lodash.omit';

import dynamoDB from './services/dynamoDB';
import { subscribe, subscribeSaga } from './subscribe';
import { setupSmokerTable } from './setupSmokerTable';
import octopushMock from './services/octopushMock';

import createUser from './effects/createUser';
import sendWelcomeMessage from './effects/sendWelcomeMessage';
import updateUser from './effects/updateUser';
import welcomeMsg from './messages/welcome';

describe('subscribe', () => {
    describe('subscribe lambda', () => {
        before(function* () {
            yield setupSmokerTable();
        });

        it('should save event.body as new smoker', function* () {
            const response = yield subscribe({ body: { name: 'john', phone: '+33614786356' } });
            expect(response.statusCode).toBe(200);
            const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

            expect(Item).toEqual({
                name: 'john',
                phone: '+33614786356',
                state: 'welcomed',
            });
        });

        it('should return error 500 if event.body as invalid phone', function* () {
            const smoker = { name: 'johnny', phone: '06147' };
            const response = yield subscribe({ body: smoker });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual('Expected { name: \'johnny\', phone: \'06147\', state: \'subscribed\' } to match { name: /\\S+/, phone: /\\+[0-9]{11}/, state: /\\S+/ }');
            const { Item } = yield dynamoDB.getItem('smoker', 'phone', '06147');

            expect(Item).toBe(undefined);
        });

        after(function* () {
            yield dynamoDB.deleteTable({
                TableName: 'smoker',
            });
        });
    });

    describe('subscribe saga', () => {
        const smokerData = { name: 'johnny', phone: '+33614786356' };
        const saga = subscribeSaga(smokerData);

        it('should create the user', () => {
            expect(saga.next().value).toEqual(call(createUser, smokerData));
        });

        it('should send the welcome message', () => {
            expect(saga.next(smokerData).value).toEqual(call(sendWelcomeMessage, smokerData.phone, smokerData.name));
        });

        it('should update the user state', () => {
            expect(saga.next(smokerData).value).toEqual(call(updateUser, { ...smokerData, state: 'welcomed' }));
        });
    });

    describe('e2e', () => {
        before(function* () {
            yield setupSmokerTable();
        });

        it('should register the user and welcome him', function* () {
            const name = 'john';
            const phone = '+33614786356';

            yield subscribe({ body: { name, phone } });
            const sms = octopushMock.sentSms.find(s => s.recipients.some(r => r === phone));

            expect(omit(sms, 'request_id')).toEqual({
                with_replies: 1,
                transactional: 1,
                text: welcomeMsg(name),
                recipients: [phone],
                type: octopushMock.constants.SMS_PREMIUM,
                mode: octopushMock.constants.INSTANTANE,
                sender: 'tobaccobot',
            });

            const Item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

            expect(Item).toEqual({
                name: 'john',
                phone: '+33614786356',
                state: 'welcomed',
            });
        });

        after(function* () {
            yield dynamoDB.deleteTable({
                TableName: 'smoker',
            });
        });
    });
});
