var db = require('../database/mysql2_db');

module.exports.createImage = async function ( image_object ) {
  try{
    var q = "INSERT INTO image (??) VALUES (?)";
    var f = [];
    var v = [];
    for(var k in image_object){
      f.push(k);
      v.push(image_object[k]);
    }
    var [results] = await db.get().query(q, [f,v]);
    image_object.id = results.insertId;
  }catch(err){
    console.log(err.stack());
  }
  return image_object;
}

module.exports.getImage = async function( image_id ){
  let [results] = await db.get().query('SELECT * FROM image WHERE id=?', [image_id] );
  if(results.length) return results[0];
  else return null;
}

module.exports.removeImage = async function( image_id ){
  let [results] = await db.get().query('DELETE FROM image WHERE id=?', [image_id] );
  if(results.affectedRows) return 1;
  else return 0;
}

module.exports.updateImage = async function( image_id, image_object ){
  var q = "UPDATE image SET ? WHERE id=?";
  var [results] = await db.get().query(q, [image_object, image_id]);
  return results.affectedRows;
}
