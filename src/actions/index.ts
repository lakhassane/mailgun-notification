import * as AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

export function saveInDB(item: Object, timestamp: Number) {

    const params = {
        TableName: "raw_webhook",
        Item: {
            id: timestamp,
            item,
        }
    }

    return dynamoDB
        .put(params)
        .promise()
        .then(res => res)
        .catch(err => err);
}

export function publishSNS(item: Object) {
    const params = {
        Message: JSON.stringify(item),
        TopicArn: 'arn:aws:sns:us-east-1:129155924648:mailgun-topic'
    }

    return sns.publish(params)
        .promise()
        .then(res => { console.log('Publishing', res) })
        .catch(err => err);
} 