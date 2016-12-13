import expect from 'expect';
import smoker from './smoker';
import { setupTables } from '../setupTables';
import dynamoDB from './dynamoDB';

describe('smoker', () => {
    beforeEach(function* () {
        yield setupTables();
    });

    describe('save', () => {
        it('should save smoker', function* () {
            const result = yield smoker.save({ name: 'john', phone: '+33614786356', state: 'tested' });
            expect(result).toEqual({});

            const item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');

            expect(item).toEqual({
                name: 'john',
                phone: '+33614786356',
                state: 'tested',
            });
        });
    });

    describe('get', () => {
        it('should retrieve user by phone', function* () {
            yield dynamoDB.putItem('smoker', {
                name: 'john',
                phone: '+33614786356',
                state: 'tested',
            });

            const result = yield smoker.get('+33614786356');
            expect(result).toEqual({
                name: 'john',
                phone: '+33614786356',
                state: 'tested',
            });
        });
    });

    describe('all', () => {
        it('should return all smokers', function* () {
            yield dynamoDB.putItem('smoker', {
                name: 'john',
                phone: '+33614786356',
                state: 'tested',
            });
            yield dynamoDB.putItem('smoker', {
                name: 'jane',
                phone: '+33666666666',
                state: 'tested',
            });

            const firstBatch = yield smoker.all(1);
            expect(firstBatch).toEqual({
                lastKey: {
                    phone: { S: '+33614786356' },
                },
                items: [
                    {
                        name: 'john',
                        phone: '+33614786356',
                        state: 'tested',
                    },
                ],
            });

            const secondBatch = yield smoker.all(1, firstBatch.lastKey);
            expect(secondBatch).toEqual({
                lastKey: {
                    phone: { S: '+33666666666' },
                },
                items: [
                    {
                        name: 'jane',
                        phone: '+33666666666',
                        state: 'tested',
                    },
                ],
            });

            const thirdBatch = yield smoker.all(1, secondBatch.lastKey);
            expect(thirdBatch).toEqual({
                lastKey: null,
                items: [],
            });
        });
    });

    describe('delete', () => {
        it('should delete target smoker', function* () {
            yield dynamoDB.putItem('smoker', {
                name: 'john',
                phone: '+33614786356',
                state: 'tested',
            });
            const result = yield smoker.delete('+33614786356');
            expect(result).toEqual({
                name: 'john',
                phone: '+33614786356',
                state: 'tested',
            });

            const item = yield dynamoDB.getItem('smoker', 'phone', '+33614786356');
            expect(item).toNotExist();
        });
    });

    afterEach(function* () {
        yield dynamoDB.deleteTable({ TableName: 'smoker' });
    });
});
