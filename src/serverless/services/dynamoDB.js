/* global config */
import AWS from 'aws-sdk';

import cpsToPromise from '../utils/cpsToPromise';

AWS.config.update(config.aws.credentials);

const dynamoDB = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

export default {
    createTable: cpsToPromise(dynamoDB.createTable, dynamoDB),
    deleteTable: cpsToPromise(dynamoDB.deleteTable, dynamoDB),
    putItem: cpsToPromise(dynamoDB.putItem, dynamoDB),
    getItem: cpsToPromise(dynamoDB.getItem, dynamoDB),
    deleteItem: cpsToPromise(dynamoDB.deleteItem, dynamoDB),
    scan: cpsToPromise(documentClient.scan, documentClient),
};
