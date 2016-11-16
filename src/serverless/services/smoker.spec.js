import expect from 'expect';
import smoker from './smoker';
import { setupSmokerTable } from '../setupSmokerTable';
import dynamoDB from './dynamoDB';

describe.only('smoker', () => {
    beforeEach(function* () {
        yield setupSmokerTable();
    });

    describe('save', () => {
        it('should save smoker', function* () {
            const result = yield smoker.save({ name: 'john', phone: '0614786356', state: 'tested' });
            expect(result).toEqual(null);

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
                state: { S: 'tested' },
            });
        });
    });

    describe('get', () => {
        it('should retrieve user by phone', function* () {
            yield dynamoDB.putItem({
                TableName: 'smoker',
                Item: {
                    name: { S: 'john' },
                    phone: { S: '0614786356' },
                    state: { S: 'tested' },
                },
            });

            const result = yield smoker.get('0614786356');
            expect(result).toEqual({
                name: 'john',
                phone: '0614786356',
                state: 'tested',
            });
        });
    });

    describe('all', () => {
        it('should return all smokers', function* () {
            yield dynamoDB.putItem({
                TableName: 'smoker',
                Item: {
                    name: { S: 'john' },
                    phone: { S: '0614786356' },
                    state: { S: 'tested' },
                },
            });
            yield dynamoDB.putItem({
                TableName: 'smoker',
                Item: {
                    name: { S: 'jane' },
                    phone: { S: '0666666666' },
                    state: { S: 'tested' },
                },
            });

            const results = yield smoker.all();
            expect(results).toEqual([
                {
                    name: 'john',
                    phone: '0614786356',
                    state: 'tested',
                },
                {
                    name: 'jane',
                    phone: '0666666666',
                    state: 'tested',
                },
            ]);
        });
    });

    describe('delete', () => {
        it('should delete target smoker', function* () {
            yield dynamoDB.putItem({
                TableName: 'smoker',
                Item: {
                    name: { S: 'john' },
                    phone: { S: '0614786356' },
                    state: { S: 'tested' },
                },
            });
            const result = yield smoker.delete('0614786356');
            expect(result).toEqual({
                name: 'john',
                phone: '0614786356',
                state: 'tested',
            });
            const searchResult = yield dynamoDB.getItem({
                TableName: 'smoker',
                Key: {
                    phone: {
                        S: '0614786356',
                    },
                },
            });

            expect(searchResult).toEqual({});
        });
    });

    afterEach(function* () {
        yield dynamoDB.deleteTable({ TableName: 'smoker' });
    });
});
