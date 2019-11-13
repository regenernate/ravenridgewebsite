let brp = "purchase"
let nav = {};
nav[brp] = true;
module.exports.base_route_path = brp;
//this variable controls whether or not this router gets loaded
module.exports.active = true;

var bro = require("../../server/bro");
var template_manager = require('../../server/views/template_manager');

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
  "home":"./services/purchasing/views/home.handlebars"
});

async function routeRequest( request, response, file_parts ){
  return bro.get(true, template_manager.executeTemplate(templates.home, {nav:nav}, "logged_in"));
}

module.exports.router = routeRequest;
