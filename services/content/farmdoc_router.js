/****

The PURPOSE of this router is to handle requests for a set of mostly static content.
It defines a set of templates which correlate to specific urls.
It is used here to load the general information pages for the RRHH website

****/


const fs = require('fs');

//the server will call the defined router method as below, passing along the request and response objects,
//and an array of the remaining url parts as separated by "/"
//any querystring will have been removed from the file_parts array but is available as request.query

//this variable controls whether or not this router gets loaded
module.exports.active = true;

var bro = require("../../server/bro");
//load any controllers needed to handle requests
var template_manager = require('../../services/template_manager');

let homepage = template_manager.compileTemplates( {"home":"./services/content/views/farmdoc_home.handlebars"}, true );
/*
var pages;
var default_page;

fs.readFile("./services/content/data/pages.json", function(error, content){
  if(error) {
    console.log("content_router error loading pages.json");
  }else{
    let c = JSON.parse(content);
    pages = c.pages;
    default_page = c.default_page;
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
    templates[i] = pages[i].template;
  }
  template_manager.compileTemplates(templates, true);
}

*/
//write a method to handle route requests and return a bro
async function routeRequest( request, response, file_parts ){
  let rtn = null;
  /*
  //if no page name, use default template
  if( !file_parts || file_parts.length == 0 ) file_parts = [ default_page ];
  //get requested page name
  let template = file_parts[0].toLowerCase();
  */
  let data_to_send = { nav:{home:true}, title:"These are the Farm Doc's Guides to CBD.", description:"The Farm Doc Guides are a resource for patients and clinicians about CBD from a medical, scientific standpoint, but in clear language you can understand. It is intented to simplify communication about CBD and how it works in the body, so folks can make better educated decisions about using these emerging products." };
  //check for requested template in templates object
  rtn = bro.get( true, template_manager.executeTemplate( homepage.home, data_to_send ) );

  return rtn;
}

module.exports.router = routeRequest;
