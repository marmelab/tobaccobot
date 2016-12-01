import config from 'config';
import AWS from 'aws-sdk';
import dynamoDBWrapper from 'aws-dynamodb';

import cpsToPromise from '../utils/cpsToPromise';

if (config.serverlessEnv !== 'deploy') {
    AWS.config.update(config.aws.credentials);
}

const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());

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
    scan: cpsToPromise((table, limit = 10, lastKey, cb) =>
        dynamoDB
        .table(table)
        .limit(limit)
        .resume(lastKey)
        .scan(function (error, data) {
            if (error) {
                return cb(error);
            }
            return cb(null, {
                items: data,
                lastKey: this.LastEvaluatedKey,
            });
        })
    ),
};
