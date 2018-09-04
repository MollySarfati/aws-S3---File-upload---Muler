var express = require('express');
var router = express.Router();

var multer = require('multer');
//npm npm i --s multer
var multerS3 = require('multer-s3');
//npm i --s multer-s3
var awsS3 = require('../functions/functionAWSS3');
var AWS = require('aws-sdk');
//npm i --s aws-sdk

const AWS_S3_KEY = {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
              }
              //create a file .env 

const myBucket = 'YOUR BUCKET NAME';

var [upload,s3] = awsS3.config(AWS_S3_KEY, myBucket);

router.get('/', (req, res, next) => {
  res.render('index');
});

// Upload single file endpoint (calls on upload middleware above)
// upload.single('name') is the key that the file accepts
router.post('/single', upload.single('image'), (req, res, next) => {
  res.redirect('/album');
});

// Upload multiple max 3
router.post('/multiple', upload.array('image', 3), (req, res, next) => {
  res.send(`Succesfully uploaded files: ${req.files.length}`);
});

// View all images
router.get('/album', (req, res, next) => {
  awsS3.readBucket(s3, myBucket).then(data => {
    res.render('album', { data: data })
  })
  .catch(err => console.log(err));
});

module.exports = router;
