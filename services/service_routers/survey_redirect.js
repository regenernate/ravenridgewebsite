module.exports.base_route_path = "monthlyusers";
//this variable controls whether or not this router gets loaded
module.exports.active = true;

var bro = require("../../server/bro");
var template_manager = require('../../server/views/template_manager');

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
  "redirect":"./services/monthlyusers/views/redirect.handlebars"
});

var base_route = "https://pharmbuddy.ravenridgehempandherbals.com/monthlyusers/";
async function routeRequest( request, response, file_parts ){
  return bro.get(true, template_manager.executeTemplate(templates.redirect, {route:base_route + file_parts.join('/')}));
}

module.exports.router = routeRequest;
