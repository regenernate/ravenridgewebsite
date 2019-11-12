var bucket, thumb_bucket;
if( process.env.NODE_ENV != "development" ){
  bucket = "farmbuddy";
  thumb_bucket = "farmbuddythumbs";
}else{
  bucket = "farmbuddytest";
  thumb_bucket = "farmbuddytestthumbs";
}

var base_image_path = 'https://' + bucket + "/" + process.env.OSS_ENDPOINT + '/';
var base_thumb_path = 'https://' + thumb_bucket + "/" + process.env.OSS_ENDPOINT + '/';

const mime_types = require('../../mime_types').getMimeTypes();
const image_types = {};
image_types[ mime_types['.jpg'] ] = '.jpg';
image_types[ mime_types['.jpeg'] ] = '.jpg';
image_types[ mime_types['.png'] ] = '.png';
image_types[ mime_types['.gif'] ] = '.gif';

var AWS = require('aws-sdk');

var s3  = new AWS.S3({
          accessKeyId: process.env.OSS_ACCESS_KEY,
          secretAccessKey: process.env.OSS_SECRET_KEY,
          endpoint: process.env.OSS_ENDPOINT
});

var s3Stream = require('s3-upload-stream');

module.exports.getFileType = function( mime ){
  return image_types[mime];
}

module.exports.getBucket = function( size ){
  if( size == "thumb" ){
    return thumb_bucket;
  }else{
    return bucket;
  }
}

module.exports.getService = function(){
  return s3;
}

module.exports.getStreamService = function(){
  return s3Stream(s3);
}
