var mime_types = require('../../server/mime_types').getMimeTypes( {'.html':true, '.json':true} );

var moment = require('moment');
var bro = require('../../server/bro');
var image = require('./image_model');
var aws = require('./aws_config');

var template_manager = require('../template_manager');
var templates = template_manager.compileTemplates({
  "input":"./services/aws_image_upload/views/input_form.handlebars"
});

module.exports.getInputForm = async function( request, response ){
  if( request.headers.accept == mime_types['.html'] ){
    return bro.get( true, template_manager.executeTemplate( templates.input, {user:request.user}, 'none') );
  }else if( request.headers.accept == mime_types['.json'] ){
    return bro.get( true, {success:true, content:template_manager.executeTemplate( templates.input, {user:request.user}, 'none') } );
  }else{
    return bro.get( true, "Image getInputForm only returns html or json formatted data ( you requested " + request.header.accept + ")." );
  }
}

module.exports.add = async function( request, response ){
  if(!request.files ) return bro.get(false, null, {success:false, message:"There was no file sent to be saved."});
  var storage_datetime = moment().format('x');
  var output = [];
  for( let f in request.files ){
    let img = request.files[f];
    if( img.success ){
      let i = await image.createImage( {file_key:img.image.Key, user_id:request.user.id, storage_datetime:storage_datetime} );

      output.push({success:true, image_id:i.id, Location:img.image.Location});
    }else{
      output.push({success:false});
    }
  }
  return bro.get(true, output);
}

module.exports.remove = async function( request, response ){
  let image_id = request.query.image_id;
  if( !image_id ) return bro.get(false, null, {success:false, message:"Removing an image requires an image id."});
  let image_object = await image.getImage(image_id);
  if(!image_object) return bro.get(false, null, {success:false, message:"There is no image with the id provided."});

  try{
    var params = {
        Key: image_object.file_key,
        Bucket: aws.getBucket("fullsize")
    };
    let p = await aws.getService().deleteObject(params).promise();
  }
  catch(err){
    return bro.get(false, null, {success:false, message:err.message});
  }
  let delete_count;
  try{
    delete_count = await image.removeImage( image_id );
  }
  catch(err){
    return bro.get(false, null, {success:false, message:err.message});
  }
  if( delete_count == 1 ) return bro.get(true, {success:true, image_id:image_id, message:"Image successfully deleted."});
  else return bro.get(false, null, {success:false, message:"The image could not be removed from the database."});
}

module.exports.index = async function( request, response ){
  return bro.get(true, {success:true, message:"There are lots of images, but I need to implement this method before you can see them!"});
}

module.exports.addTags = async function( request, response ){
  //loop over tags and save them

  return bro.get(true, {success:true, message:"Image tags saved."});
}
