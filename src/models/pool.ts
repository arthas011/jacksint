// imports
import AWS from 'aws-sdk';

// configure AWS credentials
AWS.config.update({
  accessKeyId: 'test',
  secretAccessKey: 'testkey',
  region: 'us-east-1' // e.g., 'us-east-1'
});


// Create a DynamoDB instance and document client
const DYNAMO_URL = "http://localhost:8000";
const dynamoDB = new AWS.DynamoDB({endpoint: new AWS.Endpoint(DYNAMO_URL)});
const doClient = new AWS.DynamoDB.DocumentClient({endpoint: new AWS.Endpoint(DYNAMO_URL)});


// export cursor and document client
export {dynamoDB, doClient}








