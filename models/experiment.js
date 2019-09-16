const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const s3Zip = require('s3-zip');
const S3BUCKETNAME = 'deepgesture-expstorage';
const REGION = 'us-east-2';

AWS.config.update({region: REGION});
AWS.config.getCredentials((err) => {
  if (err) throw err;
});

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  createSingle: async (jsonBody) => {
    const s3params = {
      Body: JSON.stringify(jsonBody),
      Bucket: S3BUCKETNAME,
      Key: jsonBody.id + '.json',
    };
    const dynamoparams = {
      TableName: 'Experiment',
    };
    // eslint-disable-next-line prefer-const
    let s3return = await s3.putObject(s3params).promise();
    s3return.id = jsonBody.id;
    s3return.dateAndTime = new Date().toLocaleString();
    dynamoparams.Item = s3return;
    try {
      return await docClient.put(dynamoparams).promise();
    } catch (err) {
      const params = {
        Bucket: S3BUCKETNAME,
        Key: S3.params.Key,
      };
      await s3.deleteObject(params).promise();
      throw err;
    }
  },

  getList: async () => {
    const params = {
      TableName: 'Experiment',
      ProjectionExpression: 'id, dateAndTime, ETag',
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
    const dynamoparams = {
      Key: {
        'id': id,
      },
      TableName: 'Experiment',
    };
    const s3params = {
      Bucket: S3BUCKETNAME,
      Key: id+'.json',
    };
    await s3.deleteObject(s3params).promise();
    await docClient.delete(dynamoparams).promise();
  },
};
