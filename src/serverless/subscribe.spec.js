/* global dynamoDB */
import expect from 'expect';

describe('subscribe handler', () => {
    let subscribe;

    before(function* () {
        subscribe = require('./subscribe').subscribe;
        yield require('./setupSmokerTable').setupSmokerTable();
    });

    it('should save event.body as new smoker', function* () {
        yield subscribe({ body: { name: 'john', phone: '0614786356' } });
        const { Item } = yield dynamoDB.getItem({
            TableName: 'smoker',
            Key: {
                phone: {
                    S: '0614786356',
                },
            },
        });

        expect(Item).toEqual({
            name: { S: 'john' },
            phone: { S: '0614786356' },
        });
    });
});
