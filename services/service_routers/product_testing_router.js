let brp = "product_testing";
let nav = {};
nav[brp] = true;
module.exports.base_route_path = "product_testing";
//this variable controls whether or not this router gets loaded
module.exports.active = true;

var bro = require("../../server/bro");
var template_manager = require('../../services/template_manager');

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
  "result":"./services/product_testing/views/display_result.handlebars",
  "home":"./services/product_testing/views/home.handlebars"
});

async function routeRequest( request, response, file_parts ){
  if(!file_parts.length || !file_parts[0].length)
    return bro.get(true, template_manager.executeTemplate(templates.home,{nav:nav}, "logged_in"));
  //return bro.get(true, template_manager.showSegments({segments:[
//    {text_content:'Our products are made in small batches, on premises, from fresh processed flower grown using regenerative methods.', image_content:'./content/assets/white-image.png'},
    //{text_content:'Our products are made in small batches, on premises, from fresh processed flower grown using regenerative methods.', image_content:'./content/assets/white-image.png'}
  //]}));
  //if a number, check if it is a valid test result id
  if( !isNaN(file_parts[0]) ){
    //need to check object storage to see if this test result exists

    //for now assume it does
    return bro.get(true, template_manager.executeTemplate(templates.result, {nav:nav, test_filename:file_parts[0] + ".jpg"}, "logged_in"))
  } else {
    //handle any other possibilities or  return home templates
    return bro.get(true, template_manager.executeTemplate(templates.home, null, "logged_in"));
  }
}

module.exports.router = routeRequest;
