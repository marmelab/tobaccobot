import expect from 'expect';

import dynamoDB from './dynamoDB';
import dynamoFormatToLiteral from './dynamoFormatToLiteral';

const params = {
    TableName: 'smoker',
    KeySchema: [
        { AttributeName: 'phone', KeyType: 'HASH' },  // Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: 'phone', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    },
};

const createTable = () => dynamoDB.createTable(params);

const save = data =>
    dynamoDB.putItem('smoker', data);

const get = phone =>
    dynamoDB.getItem('smoker', 'phone', phone);

const erase = phone =>
    dynamoDB.deleteItem('smoker', 'phone', phone);

const all = () =>
    dynamoDB.scan({
        TableName: 'smoker',
    }).then((result) => {
        if (!result) {
            return result;
        }

        return result.Items.map(dynamoFormatToLiteral);
    });

const check = (smoker) => {
    expect(smoker).toMatch({
        name: /\S+/,
        state: /\S+/,
        phone: /\+[0-9]{11}/,
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
