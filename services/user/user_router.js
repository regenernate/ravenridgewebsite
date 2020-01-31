module.exports.base_route_path = "user";
//this variable controls whether or not this router gets loaded
module.exports.active = false;

var bro = require("../../server/bro");
//../..
var user_controller = require("../../services/user/user");

//define get and post routes here
var routes = {
  get : {
    logout:user_controller.logout
  },
  post : {
  }
}

async function routeRequest( request, response, file_parts ){
  let lookup = routes[ String(request.method).toLowerCase() ];
  if( lookup.hasOwnProperty( file_parts[0] ) ){
    let routed_call = await lookup[ file_parts[0] ]( request, response );
    return routed_call;
  }else{
    return bro.get(false, null, "There is no implementation of " + file_parts[0] + " in user_router.");
  }
}

module.exports.router = routeRequest;
