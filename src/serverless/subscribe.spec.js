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

    it('should return error 500 if event.body as invalid phone', function* () {
        const smoker = { name: 'johnny', phone: '06147' };
        const response = yield subscribe({ body: smoker });
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(`Expected { name: 'johnny', phone: '06147' } to match { name: /\\S+/, phone: /[0-9]{10}/ }`);
        const { Item } = yield dynamoDB.getItem({
            TableName: 'smoker',
            Key: {
                phone: {
                    S: '06147',
                },
            },
        });

        expect(Item).toBe(undefined);
    });

    after(function* () {
        yield dynamoDB.deleteTable({
            TableName: 'smoker',
        });
    });
});
