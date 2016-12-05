import expect from 'expect';
import getUser from './getUser';
import dynamoDB from '../services/dynamoDB';
import { setupSmokerTable } from '../setupSmokerTable';

describe('getUser', () => {
    before(function* () {
        yield setupSmokerTable();

        yield dynamoDB.putItem('smoker', {
            name: 'Frodo',
            phone: '0102030405',
            state: 'subscribed',
        });
    });

    it('should return the user', function* () {
        const user = yield getUser('0102030405');

        expect(user).toEqual({
            name: 'Frodo',
            phone: '0102030405',
            state: 'subscribed',
        });
    });

    after(function* () {
        yield dynamoDB.deleteTable({
            TableName: 'smoker',
        });
    });
});
