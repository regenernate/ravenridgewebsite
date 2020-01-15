//load the list of current products

const fs = require('fs');

var pages;

fs.readFile("./services/product_testing/data/pages.json", function(error, content){
  if(error) {
    console.log("product_testing router error loading pages.json");
  }else{
    let c = JSON.parse(content);
    pages = c.pages;
    //now compile loaded templates
    compileTemplates();
  }
});

//this variable will hold the pre-compiled template functions for whatever pages are loaded in pages.json
var templates = {};

//this method is called after pages.json loads
function compileTemplates(){
  //extract just template name/path pairs for template manager to compile from
  for( var i in pages ){
    if( pages[i].template ) //templates can be null
      templates[i] = pages[i].template;
  }
  template_manager.compileTemplates(templates, true);

  loadTests();
}

//tests holds the data around tests to be viewablew
//titles holds the titles and descriptions for individual test files, which must be generated
var tests, titles;

function loadTests(){
  fs.readFile("./services/product_testing/data/product_data_by_test_id.json", function(error, content) {
      if (error) {
        console.log("content_controller error :: " + error.message);
      } else {
        tests = JSON.parse(content).tests;
        //create titles and descriptions for pages by inserting the specific test details into the base title / description, keyed by test id
        //currently hardcodes "result" as the page template that shows different tests - probably won't change so will leave it for now
        titles = {};
        for( let i in tests ){
          titles[ i ] = {title:insertTestDetails(pages.result.title, tests[i]), desc:insertTestDetails(pages.result.desc, tests[i])};
        }
      }
  });
}

//method to replace any {{vars}} found in content with data matching the {{var}} in data
function insertTestDetails( content, data ){
  for( let i in data ){
    content = content.split( "{{" + i + "}}" ).join( data[i] );
  }
  return content;
}

//need to decide how to merge the

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
    return bro.get(true, template_manager.executeTemplate(templates.home,{nav:nav, title:pages.home.title, description:pages.home.desc}));
  } else {
    let fp0 = file_parts[0];
    //need to check object storage to see if this test result exists
    if( !tests.hasOwnProperty( fp0 ) )
      return bro.get(true, template_manager.executeTemplate(template_manager.unsupported_route, {nav:nav, title:pages.error.title, description:pages.error.desc, message:"<h1>There is no test matching this product.</h1><p>If you scanned a product URL and reached this page, please email Nathan at ravenridgehempandherbals @ gmail.com.</p>"}));
    else
      return bro.get(true, template_manager.executeTemplate(templates.result, {nav:nav, test_filename:fp0 + ".pdf", title:titles[fp0].title, description:titles[fp0].desc, product_data:tests[fp0], }));
  }
}

module.exports.router = routeRequest;
