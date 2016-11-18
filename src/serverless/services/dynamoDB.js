import config from 'config';
import AWS from 'aws-sdk';
import dynamoDBWrapper from 'aws-dynamodb';

import cpsToPromise from '../utils/cpsToPromise';

AWS.config.update(config.aws.credentials);

const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());
const documentClient = new AWS.DynamoDB.DocumentClient();
dynamoDB.on('error', (operation, error, payload) => console.error({ operation, error, payload }));
export default {
    createTable:
    cpsToPromise(dynamoDB.client.createTable, dynamoDB.client),
    deleteTable: cpsToPromise(dynamoDB.client.deleteTable, dynamoDB.client),
    putItem: cpsToPromise((table, item, cb) =>
        dynamoDB
        .table(table)
        .return(dynamoDB.ALL_OLD)
        .insert_or_replace(item, cb)),
    getItem: cpsToPromise((table, attr, value, cb) =>
        dynamoDB
        .table(table)
        .where(attr).eq(value)
        .get(cb)),
    deleteItem: cpsToPromise((table, attr, value, cb) =>
        dynamoDB
        .table(table)
        .where(attr).eq(value)
        .return(dynamoDB.ALL_OLD)
        .delete(cb)),
    scan: cpsToPromise(documentClient.scan, documentClient),
};
