// command to run in dynamoDb shell (localhost:8000/shell) to get one smoker by its phone number

var params = {
    TableName: 'smoker',
    Key: {
        phone: { S: '0123456789' }
    },
    ReturnConsumedCapacity: 'TOTAL' // optional (NONE | TOTAL | INDEXES)
};
dynamodb.getItem(params, function(err, data) {
    if (err) ppJson(err);
    else ppJson(data);
});
