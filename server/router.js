var path = require('path');

async function route( request, response, routes ){
  let filePath = request.url;
  let segments = filePath.split("/");
  if( !routes ) throw new Error( "You must send a routes object to the route method." );
  let lookup = routes[ request.method.toLowerCase() + "s" ];
  if( !lookup ) throw new Error( "Server doesn't support the " + request.method + " method." );
  if(segments[0] == "" || segments[0] == "." ) segments.shift();
  if( segments.length == 1 || segments[1] == "list" || segments[1] == "index" || segments[1] == "" ){
    //route to the list method
    if( lookup.hasOwnProperty( "index" ) ){
      return await lookup.index( request, response );
    }else {
      throw new Error( "Server doesn't support the " + request.method + " for the index route.");
    }
  }else {
    //direct to sub route
    try{
      console.log("ROUTER.JS  :: " + segments[1], routes);
      return await lookup[segments[1]]( request, response );
    }catch(error){
      console.log(error.message);
      throw new Error( "The " + request.method + " route for " + segments[1] + " is not defined.");
    }
  }
}

module.exports.route = route;
