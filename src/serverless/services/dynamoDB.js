import config from 'config';
import AWS from 'aws-sdk';
import dynamoDBWrapper from 'aws-dynamodb';

import logger from './logger';

if (config.serverlessEnv !== 'deploy') {
    AWS.config.update(config.aws.credentials);
}

const dynamoDB = dynamoDBWrapper(new AWS.DynamoDB());
dynamoDB.on('error', (operation, error, payload) => logger.error(error.message, { operation, payload, stack: error.stack }));

export default {
    dynamoDB,
    createTable(params) {
        return new Promise((resolve, reject) => {
            dynamoDB.on('error', (operation, error) => reject(error));

            dynamoDB.client.createTable(params, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                dynamoDB.client.waitFor('tableExists', params, (errTableExists, result) => {
                    if (errTableExists) return reject(errTableExists);
                    return resolve(result);
                });
            });
        });
    },
    deleteTable(params) {
        return new Promise((resolve, reject) => {
            dynamoDB.on('error', (operation, error) => reject(error));

            dynamoDB.client.deleteTable(params, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                dynamoDB.client.waitFor('tableNotExists', params, (errTableExists, result) => {
                    if (errTableExists) return reject(errTableExists);
                    return resolve(result);
                });
            });
        });
    },
    putItem(table, item) {
        return new Promise((resolve, reject) => {
            dynamoDB.on('error', (operation, error) => reject(error));

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
            dynamoDB.on('error', (operation, error) => reject(error));

            dynamoDB
            .table(table)
            .where(attr).eq(value)
            .get((err, result) => {
                if (err) return reject(err);
                // dynamoDB returns an empty object when it cannot find the one requested
                if (!result.phone) {
                    return resolve(null);
                }

                return resolve(result);
            });
        });
    },
    deleteItem(table, attr, value) {
        return new Promise((resolve, reject) => {
            dynamoDB.on('error', (operation, error) => reject(error));

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
            dynamoDB.on('error', (operation, error) => reject(error));

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
