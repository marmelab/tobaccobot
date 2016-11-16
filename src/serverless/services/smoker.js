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

const save = (data) => {
    const result = dynamoDB.putItem({
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
    });

    return dynamoFormatToLiteral(result);
};

const check = (smoker) => {
    expect(smoker).toMatch({
        name: /\S+/,
        state: /\S+/,
        phone: /[0-9]{10}/,
    });
    return true;
};

export default {
    createTable,
    save,
    check,
};
