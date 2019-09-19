

module.exports.log = function(){
  if( process.env.LOG_LEVEL > 0 ){
    console.log.apply( null, arguments );
  }
}
