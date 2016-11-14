import dynamoDB from './dynamoDB';
import expect from 'expect';

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

const save = data => dynamoDB.putItem({
    TableName: 'smoker',
    Item: {
        name: {
            S: data.name,
        },
        phone: {
            S: data.phone,
        },
    },
});

const check = (smoker) => {
    expect(smoker).toMatch({
        name: /\S+/,
        phone: /[0-9]{10}/,
    });
    return true;
};

export default {
    createTable,
    save,
    check,
};
