import expect from 'expect';
import sg, { call } from 'sg.js';

import dynamoDB from './services/dynamoDB';
import { subscribe, subscribeSaga } from './subscribe';
import { setupSmokerTable } from './setupSmokerTable';

import createUser from './effects/createUser';
import sendWelcomeMessage from './effects/sendWelcomeMessage';
import updateUser from './effects/updateUser';

describe('subscribe', () => {
    describe.only('subscribe lambda', () => {
        before(function* () {
            yield setupSmokerTable();
        });

        it('should save event.body as new smoker', function* () {
            const response = yield subscribe({ body: { name: 'john', phone: '0614786356' } });
            expect(response.statusCode).toBe(200);
            const Item = yield dynamoDB.getItem('smoker', 'phone', '0614786356');

            expect(Item).toEqual({
                name: 'john',
                phone: '0614786356',
                state: 'welcomed',
            });
        });

        it('should return error 500 if event.body as invalid phone', function* () {
            const smoker = { name: 'johnny', phone: '06147' };
            const response = yield subscribe({ body: smoker });
            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual('Expected { name: \'johnny\', phone: \'06147\', state: \'subscribed\' } to match { name: /\\S+/, phone: /[0-9]{10}/, state: /\\S+/ }');
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
        const smokerData = { name: 'johnny', phone: '0614786356' };
        const saga = subscribeSaga(smokerData);

        it('should create the user', () => {
            expect(saga.next(smokerData).value).toEqual(call(createUser, smokerData));
        });

        it('should send the welcome message', () => {
            expect(saga.next(smokerData).value).toEqual(call(sendWelcomeMessage, smokerData));
        });

        it('should update the user state', () => {
            expect(saga.next(smokerData).value).toEqual(call(updateUser, { ...smokerData, state: 'welcomed' }));
        });
    });
});
