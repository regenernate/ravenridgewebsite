module.exports.base_route_path = "product_testing";
//this variable controls whether or not this router gets loaded
module.exports.active = true;

var bro = require("../../server/bro");
var template_manager = require('../../server/views/template_manager');

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
  "result":"./content/product_testing/display_result.handlebars",
  "home":"./content/product_testing/home.handlebars"
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
  if(!file_parts.length || !file_parts[0].length)
    return bro.get(true, template_manager.executeTemplate(templates.home));
  //return bro.get(true, template_manager.showSegments({segments:[
//    {text_content:'Our products are made in small batches, on premises, from fresh processed flower grown using regenerative methods.', image_content:'./content/assets/white-image.png'},
    //{text_content:'Our products are made in small batches, on premises, from fresh processed flower grown using regenerative methods.', image_content:'./content/assets/white-image.png'}
  //]}));
  //if a number, check if it is a valid test result id
  if( !isNaN(file_parts[0]) ){
    //need to check object storage to see if this test result exists

    //for now assume it does
    return bro.get(true, template_manager.executeTemplate(templates.result, {test_filename:file_parts[0] + ".jpg"}))
  }
  let lookup = routes[ String(request.method).toLowerCase() ];
  if( lookup.hasOwnProperty( file_parts[0] ) ){
    let routed_call = await lookup[ file_parts[0] ]( request, response );
    return routed_call;
  }else{
    return bro.get(false, null, "There is no implementation of " + file_parts[0] + " in about_router.");
  }
}

module.exports.router = routeRequest;
