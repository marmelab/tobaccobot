// command to run in dynamoDb shell (localhost:8000/shell) to get all smokers

dynamodb.scan({
    TableName: 'smoker',
}, function (error, result) {
    if (error) {
       ppJson(error);
    }
    ppJson(result);
});
