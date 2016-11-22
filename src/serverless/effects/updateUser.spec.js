import expect from 'expect';
import updateUser from './updateUser';
import dynamoDB from '../services/dynamoDB';
import { setupSmokerTable } from '../setupSmokerTable';

describe('updateUser', () => {
    before(function* () {
        yield setupSmokerTable();

        yield dynamoDB.putItem('smoker', {
            name: 'Frodo',
            phone: '0102030405',
            state: 'subscribed',
        });
    });

    it('should update the user', function* () {
        yield updateUser({
            name: 'Frodo',
            phone: '0102030405',
            state: 'foo',
        });

        const user = yield dynamoDB.getItem('smoker', 'phone', '0102030405');

        expect(user).toEqual({
            name: 'Frodo',
            phone: '0102030405',
            state: 'foo',
        });
    });

    after(function* () {
        yield dynamoDB.deleteTable({
            TableName: 'smoker',
        });
    });
});
