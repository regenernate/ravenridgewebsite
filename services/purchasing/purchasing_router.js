let brp = "purchase"
let nav = {};
nav[brp] = true;
module.exports.base_route_path = brp;
//this variable controls whether or not this router gets loaded
module.exports.active = true;

var bro = require("../../server/bro");
var template_manager = require('../../services/template_manager');

var pagetitle = "Purchase NC made Full Spectrum Hemp products.";
var pagedesc = "RavenRidge Family Farm sells full spectrum hemp sublingual and topical salve products for reasonable prices from plants we grow on our farm in NC.";

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
  "home":"./services/purchasing/views/home.handlebars"
});

async function routeRequest( request, response, file_parts ){
  return bro.get(true, template_manager.executeTemplate(templates.home, {nav:brp, title:pagetitle, desc:pagedesc}));
}

module.exports.router = routeRequest;
