#tobaccobot

##install
Requirements:
 - With docker
    * Docker
    * docker-compose
  - without docker
    * node 4.3.2
    * Java Runtime Engine (JRE) version 6.x or newer
    * [dynamoDB](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)

```sh
    make dk_install
```
or without docker ()
```sh
    make install
```
Be careful: make install will not work properly if using node 5 or newer.

##development
```sh
make dk_run
```
will use docker to run
 - webpack-dev-server: webpack server to serve front-end static page (port 3001)
 - serverless-dev-server: serverless webpack plugin to serve lambda (port 3000)
 - dynamodb (port 8000)

To initialize smoker table do
```
make dk_setup_smoker_table
```

The lambda can be tested by sending request on port 3000

POST /subscribe
```json
{
    "name": "john",
    "phone": "0123456789",
}
```
POST bot_conversation
```json
{
    "phone": "0123456789",
    "text": "hello world"
}
```

Lambda can also be called with the serverless webpack command (emulate production environment)
```sh
docker-compose -f docker-compose.util.yml run --rm serverless webpack invoke -f lambda_name -p event.json
```

##test
```sh
make test
```

##Exploring dynamoDB
dynamoDB come with a shell accessible on localhost:8000/shell.
In this shell you can execute javascript to query dynamoDb.
The shell use the api of an [aws-sdk AWS.DynamoDB instance](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html) (no helper)
Some useful script are in the DynamoDbScript folder, to use them simply copy paste in the shell or upload them.
