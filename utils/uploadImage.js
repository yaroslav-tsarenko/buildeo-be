require('dotenv').config();
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    endpoint: process.env.AWS_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    s3ForcePathStyle: true,
});

const uploadImage = async (buffer, fileName, mimetype = 'application/octet-stream') => {
    if (!buffer) throw new Error("Buffer is missing");

    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
    };

    await s3.upload(params).promise();

    return `https://cdn.allship.ai/${fileName}`;
};

module.exports = { uploadImage };