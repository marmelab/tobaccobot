// command to run in dynamoDb shell (localhost:8000/shell) to describe smoker table

var params = {
    TableName: 'smoker',
};
dynamodb.describeTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
