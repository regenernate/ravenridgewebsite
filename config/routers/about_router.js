module.exports.base_route_path = "about";
//this variable controls whether or not this router gets loaded
module.exports.active = false;

var bro = require("../../server/bro");
var template_manager = require('../../server/views/template_manager');

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
  "index":"./content/about/index.handlebars"
});
/** define unique components that are used by this set of routes **/
var components = template_manager.compileComponents({
});

var routes = {
  get : {
  },
  post : {
  }
}

async function routeRequest( request, response, file_parts ){
  if(!file_parts.length)
    return bro.get(true, template_manager.executeTemplate(templates.index));
  //return bro.get(true, template_manager.showSegments({segments:[
//    {text_content:'Our products are made in small batches, on premises, from fresh processed flower grown using regenerative methods.', image_content:'./content/assets/white-image.png'},
    //{text_content:'Our products are made in small batches, on premises, from fresh processed flower grown using regenerative methods.', image_content:'./content/assets/white-image.png'}
  //]}));
  let lookup = routes[ String(request.method).toLowerCase() ];
  if( lookup.hasOwnProperty( file_parts[0] ) ){
    let routed_call = await lookup[ file_parts[0] ]( request, response );
    return routed_call;
  }else{
    return bro.get(false, null, "There is no implementation of " + file_parts[0] + " in about_router.");
  }
}

module.exports.router = routeRequest;
