/* global config */
import AWS from 'aws-sdk';
import cpsToPromise from '../utils/cpsToPromise';

AWS.config.update(config.aws.credentials);

const dynamoDB = new AWS.DynamoDB();

export default {
    createTable: cpsToPromise(dynamoDB.createTable, dynamoDB),
    putItem: cpsToPromise(dynamoDB.putItem, dynamoDB),
};
