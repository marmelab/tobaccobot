var params = {
    TableName: 'smoker',
};
dynamodb.describeTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
