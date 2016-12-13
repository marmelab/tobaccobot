import expect from 'expect';
import omit from 'lodash.omit';
import uuid from 'uuid';

import dynamoDB from './dynamoDB';

const params = {
    TableName: 'archive',
    KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },  // Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    },
};

const createTable = () => dynamoDB.createTable(params);

const save = data =>
    dynamoDB.putItem('archive', data);

const get = id =>
    dynamoDB.getItem('archive', 'id', id);

const erase = id =>
    dynamoDB.deleteItem('archive', 'id', id);

const all = (limit, lastKey) =>
    dynamoDB.scan('archive', limit, lastKey);

const archive = smoker => save({
    ...omit(smoker, 'phone'),
    id: uuid(),
});

const check = (data) => {
    expect(data).toMatch({
        name: /\S+/,
        state: /\S+/,
    });
    return true;
};

export default {
    all,
    archive,
    check,
    createTable,
    delete: erase,
    get,
    save,
};
