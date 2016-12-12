/* globals dynamodb, ppJson */
// command to run in dynamoDb shell (localhost:8000/shell) to describe smoker table

dynamodb.describeTable({
    TableName: 'smoker',
}, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

dynamodb.describeTable({
    TableName: 'archive',
}, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
