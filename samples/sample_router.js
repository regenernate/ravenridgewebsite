
//The server will load active routers and if a request comes in with the base_route_path as specified below,
//the server will call the defined router method as below, passing along the request and response objects,
//and an array of the remaining url parts as separated by "/"
//any querystring will have been removed from the file_parts array but is available as request.query

//this variable tells the server what urls to route here
let brp = "{base route handled by this router}";
module.exports.base_route_path = brp;
//this variable controls whether or not this router gets loaded
module.exports.active = false;

//The server expects a basic return object or an error to be thrown
//load the basic return object prototype
var bro = require("../../server/bro");
//load any controllers needed to handle requests

//define get and post routes here as {url segment}:{method_to_call}
var routes = {
  get : {
  },
  post : {
  }
}

//write a method to handle route requests and return a bro
async function routeRequest( request, response, file_parts ){
  let lookup = routes[ String(request.method).toLowerCase() ];
  if( lookup.hasOwnProperty( file_parts[0] ) ){
    let routed_call = await lookup[ file_parts[0] ]( request, response );
    return routed_call;
  }else{
    return bro.get(false, null, "There is no implementation of " + file_parts[0] + " in " + brp + ".");
  }
}

module.exports.router = routeRequest;
