const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const s3Zip = require('s3-zip');
const S3BUCKETNAME = 'deepgesture-expstorage';
const REGION = 'us-east-2';

// AWS.config.loadFromPath(process.env.awsconfigpath);
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  createSingle: async (jsonBody) => {

    let subject = jsonBody.subject;
    const username = subject.id;
    const sit = subject.situation;
    delete subject['id'];
    delete subject['situation'];
    
    const dynamoparams = {
      Expected: {
        'id': {
          Exists: false,
        },
      },
      Item: {
        id: jsonBody.id,
        username: username,
        situation: sit,
        subject: subject,
        dateAndTime: Date().toLocaleString(),
      },
      ReturnItemCollectionMetrics: 'SIZE',
      TableName: 'Experiment',
    };
    const s3params = {
      Body: JSON.stringify(jsonBody),
      Bucket: S3BUCKETNAME,
      Key: jsonBody.id + '.json',
    };
    // eslint-disable-next-line prefer-const
    await docClient.put(dynamoparams).promise();
    await s3.putObject(s3params).promise();
    return true;
  },

  getList: async () => {
    const params = {
      TableName: 'Experiment',
      ProjectionExpression: 'id, dateAndTime, username, situation',
    };
    return await docClient.scan(params).promise();
  },

  getSingle: async (id, opts) => {
    const s3params = {
      Bucket: S3BUCKETNAME,
      Key: id+'.json',
    };
    if (opts.download) {
      return s3Zip
          .archive({region: REGION, bucket: S3BUCKETNAME}, '', [id+'.json']);
    } else {
      const s3return = await s3.getObject(s3params).promise();
      return JSON.parse(s3return.Body);
    }
  },

  deleteSingle: async (id) => {
    const s3params = {
      Bucket: S3BUCKETNAME,
      Key: id+'.json',
    };
    const dynamoparams = {
      Key: {
        'id': id,
      },
      TableName: 'Experiment',
      ReturnItemCollectionMetrics: 'SIZE',
    };
    await s3.deleteObject(s3params).promise();
    return await docClient.delete(dynamoparams).promise();
  },
};
