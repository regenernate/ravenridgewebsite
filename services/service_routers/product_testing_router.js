//load the list of current products

const fs = require('fs');

var tests;
fs.readFile("./services/product_testing/data/product_data_by_test_id.json", function(error, content) {
    if (error) {
      console.log("content_controller error :: " + error.message);
    } else {
      tests = JSON.parse(content).tests;
    }
});

let brp = "product_testing";
//hack the nav to show "third_party_testing" active in "product_testing" route
const nav = "third_party_testing";
module.exports.base_route_path = brp;
//this variable controls whether or not this router gets loaded
module.exports.active = true;

var bro = require("../../server/bro");
var template_manager = require('../../services/template_manager');

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
  "result":"./services/product_testing/views/result.handlebars",
  "home":"./services/product_testing/views/home.handlebars"
});

async function routeRequest( request, response, file_parts ){
  //if there is no test name sent, show list of all products and their coas
  if(!file_parts.length || !file_parts[0].length || isNaN(file_parts[0])){
    return bro.get(true, template_manager.executeTemplate(templates.home,{nav:nav}));
  } else {
    let fp0 = file_parts[0];
    //need to check object storage to see if this test result exists
    if( !tests.hasOwnProperty( fp0 ) )
      return bro.get(true, template_manager.executeTemplate(template_manager.unsupported_route, {nav:nav, message:"<h1>There is no test matching this product.</h1><p>If you scanned a product URL and reached this page, please email Nathan at ravenridgehempandherbals @ gmail.com.</p>"}));
    else
      return bro.get(true, template_manager.executeTemplate(templates.result, {nav:nav, test_filename:fp0 + ".pdf", product_data:tests[fp0]}));
  }
}

module.exports.router = routeRequest;
