import expect from 'expect';
import omit from 'lodash.omit';
import uuid from 'uuid';
import archive from './archive';
import { setupTables } from '../setupTables';
import dynamoDB from './dynamoDB';

describe('archive', () => {
    beforeEach(function* () {
        yield setupTables();
    });

    describe('archive', () => {
        it('should archive a smoker', function* () {
            const expectedUser = { name: 'john', phone: '+33614786356', state: 'tested' };
            const result = yield archive.archive(expectedUser);
            expect(omit(result, 'id')).toEqual(expectedUser);
            expect(result.id).toExist();

            const { items } = yield dynamoDB.scan('archive', 10);
            const [item] = items;
            expect(omit(item, 'id')).toEqual(omit(expectedUser, ['phone']));
            expect(item.id).toExist();
            expect(item.phone).toNotExist();
        });
    });

    describe('save', () => {
        it('should save archive', function* () {
            const id = uuid();
            const expected = { name: 'john', id, state: 'tested' };
            const result = yield archive.save(expected);
            expect(result).toEqual(expected);

            const item = yield dynamoDB.getItem('archive', 'id', id);
            expect(item).toEqual(expected);
        });
    });

    describe('get', () => {
        it('should retrieve user by id', function* () {
            yield dynamoDB.putItem('archive', {
                name: 'john',
                id: 'foo',
                state: 'tested',
            });

            const result = yield archive.get('foo');
            expect(result).toEqual({
                name: 'john',
                id: 'foo',
                state: 'tested',
            });
        });
    });

    describe('all', () => {
        it('should return all archives', function* () {
            yield dynamoDB.putItem('archive', {
                name: 'john',
                id: 'foo',
                state: 'tested',
            });
            yield dynamoDB.putItem('archive', {
                name: 'jane',
                id: '+33666666666',
                state: 'tested',
            });

            const firstBatch = yield archive.all(1);
            expect(firstBatch).toEqual({
                lastKey: {
                    id: { S: 'foo' },
                },
                items: [
                    {
                        name: 'john',
                        id: 'foo',
                        state: 'tested',
                    },
                ],
            });

            const secondBatch = yield archive.all(1, firstBatch.lastKey);
            expect(secondBatch).toEqual({
                lastKey: {
                    id: { S: '+33666666666' },
                },
                items: [
                    {
                        name: 'jane',
                        id: '+33666666666',
                        state: 'tested',
                    },
                ],
            });

            const thirdBatch = yield archive.all(1, secondBatch.lastKey);
            expect(thirdBatch).toEqual({
                lastKey: null,
                items: [],
            });
        });
    });

    describe('delete', () => {
        it('should delete target archive', function* () {
            yield dynamoDB.putItem('archive', {
                name: 'john',
                id: 'foo',
                state: 'tested',
            });
            const result = yield archive.delete('foo');
            expect(result).toEqual({
                name: 'john',
                id: 'foo',
                state: 'tested',
            });
            const searchResult = yield dynamoDB.getItem('archive', 'id', 'foo');

            expect(searchResult).toEqual(null);
        });
    });

    afterEach(function* () {
        yield dynamoDB.deleteTable({ TableName: 'archive' });
    });
});
