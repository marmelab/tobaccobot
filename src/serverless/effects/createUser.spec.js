import expect from 'expect';
import createUser from './createUser';
import dynamoDB from '../services/dynamoDB';
import { setupSmokerTable } from '../setupSmokerTable';

describe('createUser', () => {
    before(function* () {
        yield setupSmokerTable();
    });

    it('should create the user', function* () {
        yield createUser({
            name: 'Frodo',
            phone: '+33102030405',
        });

        const user = yield dynamoDB.getItem('smoker', 'phone', '+33102030405');

        expect(user).toEqual({
            name: 'Frodo',
            phone: '+33102030405',
            state: 'subscribed',
        });
    });

    it('should return the created user', function* () {
        const user = yield createUser({
            name: 'Frodo',
            phone: '+33102030405',
        });

        expect(user).toEqual({
            name: 'Frodo',
            phone: '+33102030405',
            state: 'subscribed',
        });
    });

    after(function* () {
        yield dynamoDB.deleteTable({
            TableName: 'smoker',
        });
    });
});
