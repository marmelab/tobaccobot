import config from 'config';
import AWS from 'aws-sdk';
import dynamoDBWrapper from 'aws-dynamodb';

import logger from './logger';

if (config.serverlessEnv !== 'deploy') {
    AWS.config.update(config.aws.credentials);
}

export default {
    createTable(params) {
        return new Promise((resolve, reject) => {
            const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());

            dynamoDB.on('error', (operation, error, payload) => logger.error(error.message, { operation, payload, stack: error.stack }));

            dynamoDB.client.createTable(params, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
    deleteTable(params) {
        return new Promise((resolve, reject) => {
            const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());

            dynamoDB.on('error', (operation, error, payload) => reject({ operation, error, payload }));

            dynamoDB.client.deleteTable(params, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
    putItem(table, item) {
        return new Promise((resolve, reject) => {
            const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());

            dynamoDB.on('error', (operation, error, payload) => reject({ operation, error, payload }));

            dynamoDB
            .table(table)
            .return(dynamoDB.ALL_OLD)
            .insert_or_replace(item, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
    getItem(table, attr, value) {
        return new Promise((resolve, reject) => {
            const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());

            dynamoDB.on('error', (operation, error, payload) => reject({ operation, error, payload }));

            dynamoDB
            .table(table)
            .where(attr).eq(value)
            .get((err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
    deleteItem(table, attr, value) {
        return new Promise((resolve, reject) => {
            const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());

            dynamoDB.on('error', (operation, error, payload) => reject({ operation, error, payload }));

            dynamoDB
            .table(table)
            .where(attr).eq(value)
            .return(dynamoDB.ALL_OLD)
            .delete((err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
    scan(table, limit = 10, lastKey) {
        return new Promise((resolve, reject) => {
            const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());

            dynamoDB.on('error', (operation, error, payload) => reject({ operation, error, payload }));

            dynamoDB
            .table(table)
            .limit(limit)
            .resume(lastKey)
            .scan(function (err, data) {
                if (err) return reject(err);
                return resolve({
                    items: data,
                    lastKey: this.LastEvaluatedKey,
                });
            });
        });
    },
};
