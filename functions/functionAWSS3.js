'use strict';

var multer = require('multer');
var multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
// let readBucketStore

module.exports.config = function(keyS3, myBucket){
  AWS.config.update(
    keyS3
  );
  var s3 = new AWS.S3();
  var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: myBucket,
      // Set public read permissions
      acl: 'public-read',
      // Auto detect contet type
      contentType: multerS3.AUTO_CONTENT_TYPE,
      // Set key/ filename as original uploaded name
      key: function (req, file, cb) {
        cb(null, file.originalname)
      }
    })
  })
  return [upload, s3]
}

module.exports.readBucket = async function(s3, myBucket){
  var readBucket
  await s3.listObjects({Bucket: myBucket}).promise()
    .then(data => {
      const baseURL = `https://s3.amazonaws.com/${myBucket}/`;
      readBucket = data.Contents.map(e => baseURL + e.Key);
    })
    .catch(err => console.log(err));
    console.log("readBucket",readBucket)
    return readBucket;
}
