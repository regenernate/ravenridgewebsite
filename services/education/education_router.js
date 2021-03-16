/****

The PURPOSE of this router is to handle requests for a set of mostly static content.
It defines a set of templates which correlate to specific urls.
It is used here to load the general information pages for the RRHH website

****/


const fs = require('fs');
//The server will load active routers and if a request comes in with the base_route_path as specified below,
//the server will call the defined router method as below, passing along the request and response objects,
//and an array of the remaining url parts as separated by "/"
//any querystring will have been removed from the file_parts array but is available as request.query

//this variable tells the server what urls to route here
let brp = "content";
let nav = {};
nav[brp] = true;
module.exports.base_route_path = brp;
//this variable controls whether or not this router gets loaded
module.exports.active = true;

//The server expects a basic return object or an error to be thrown
//load the basic return object prototype
var bro = require("../../server/bro");
//load any controllers needed to handle requests
var template_manager = require('../../services/template_manager');

var pages;
var default_page;

fs.readFile("./services/education/data/pages.json", function(error, content){
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

var faqs;
fs.readFile("./services/education/data/faqs.json", function(error, content) {
    if (error) {
      console.log("content_controller error :: " + error.message);
    } else {
      faqs = JSON.parse(content).faqs;
    }
});

var tests;
fs.readFile("./services/education/data/testing.json", function(error, content){
  if(error){
    console.log("education_router error :: " + error.message );
  }else{
    tests = JSON.parse(content).tests;
  }
});

//write a method to handle route requests and return a bro
async function routeRequest( request, response, file_parts ){
  let rtn = null;
  //if no page name, use default template
  if( !file_parts || file_parts.length == 0 ) file_parts = [ default_page ];
  //get requested page name
  let template = file_parts[0].toLowerCase();
  //check for requested template in templates object
  let data_to_send = { nav:{learn:true}, title:pages[template].title, description:pages[template].desc };
  if( templates.hasOwnProperty( template )){
    data_to_send.nav[ template ] = true;
    if( template == "product_faqs" ){
      data_to_send.faqs = faqs;
    }else if( template == "transparent_pricing" ){
      data_to_send.pricing = pricing;
    }else if( template == "third_party_testing"){
      data_to_send.tests = tests;
    }
    //execute template
    rtn = bro.get( true, template_manager.executeTemplate( templates[ template ], data_to_send ) );
  }else{
    data_to_send.nav.missing_page = true;
    //otherwise, show unsupported route message for now
    data_to_send.message = "Not sure what you're looking for? Try one of the menu items above!"
    rtn = bro.get(true, template_manager.executeTemplate( template_manager.unsupported_route, data_to_send ) );
  }
  return rtn;
}

//for display on the transparent_pricing page
var pricing = {
  salve:[
    {
      strength:"1%",
      sizes:[
        {
          size:"1", total_cbd:"300", full_price:"39", subscription_price:"35", full_mg_price:".13", subscription_mg_price:".12"
        },
        {
          size:"2", total_cbd:"600", full_price:"55", subscription_price:"48", full_mg_price:".09", subscription_mg_price:".08"
        },
        {
          size:"4", total_cbd:"1200", full_price:"88", subscription_price:"76", full_mg_price:".07", subscription_mg_price:".06"
        }
      ]
    },{
      strength:"2%",
      sizes:[
        {
          size:"1", total_cbd:"600", full_price:"49", subscription_price:"42", full_mg_price:".08", subscription_mg_price:".07"
        },
        {
          size:"2", total_cbd:"1200", full_price:"82", subscription_price:"75", full_mg_price:".07", subscription_mg_price:".06"
        } /*         {
                  size:"4", total_cbd:"2400", full_price:"130", subscription_price:"110", full_mg_price:".054", subscription_mg_price:".046"
                }
 */
      ]
    }
  ],
  sublingual:[
    {
      strength:"1%", total_cbd:"300", full_price:"27", subscription_price:"24", full_mg_price:".09", subscription_mg_price:".08"
    },
    {
      strength:"2%", total_cbd:"600", full_price:"40", subscription_price:"36", full_mg_price:".07", subscription_mg_price:".06"
    },
    {
      strength:"3%", total_cbd:"900", full_price:"54", subscription_price:"48", full_mg_price:".06", subscription_mg_price:".05"
    },
    {
      strength:"4%", total_cbd:"1200", full_price:"63", subscription_price:"56", full_mg_price:".05", subscription_mg_price:".047"
    }
  ]
}

module.exports.router = routeRequest;
