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
    dynamoDB.putItem({
        TableName: 'smoker',
        Item: {
            name: {
                S: data.name,
            },
            phone: {
                S: data.phone,
            },
            state: {
                S: data.state,
            },
        },
        ReturnValues: 'ALL_OLD',
    })
    .then((result) => {
        if (!result) {
            return result;
        }

        return dynamoFormatToLiteral(result.Item);
    });

const getPhoneQuery = phone => ({
    TableName: 'smoker',
    Key: {
        phone: {
            S: phone,
        },
    },
});

const get = phone =>
    dynamoDB.getItem(getPhoneQuery(phone))
    .then((result) => {
        if (!result) {
            return result;
        }

        return dynamoFormatToLiteral(result.Item);
    });

const erase = phone =>
    dynamoDB.deleteItem({
        TableName: 'smoker',
        Key: {
            phone: {
                S: phone,
            },
        },
        ReturnValues: 'ALL_OLD',
    })
    .then((result) => {
        if (!result) {
            return result;
        }

        return dynamoFormatToLiteral(result.Attributes);
    });

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
        phone: /[0-9]{10}/,
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
