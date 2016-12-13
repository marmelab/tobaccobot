import expect from 'expect';

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

const check = (archive) => {
    expect(archive).toMatch({
        name: /\S+/,
        state: /\S+/,
    });
    return true;
};

export default {
    all,
    check,
    createTable,
    delete: erase,
    get,
    save,
};
