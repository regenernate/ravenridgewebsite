//this variable controls whether or not this router gets loaded
module.exports.active = true;

var bro = require("../../server/bro");
var template_manager = require('../../services/template_manager');

var pagetitle = "Purchase NC made Full Spectrum Hemp products.";
var pagedesc = "RavenRidge Family Farm sells full spectrum hemp sublingual and topical salve products for reasonable prices from plants we grow on our farm in NC.";

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
  "home":"./services/purchasing/views/home.handlebars",
  "starter_pack":"./services/purchasing/views/starter_pack.handlebars",
  "sublingual":"./services/purchasing/views/sublingual.handlebars",
  "salve":"./services/purchasing/views/salve.handlebars"
});

async function routeRequest( request, response, file_parts ){
  let data_to_send = { nav:{shop:true}, title:pagetitle, desc:pagedesc };

  let rtn = null;
  //if no page name, use default template
  if( !file_parts || file_parts.length == 0 ) file_parts = [ "home" ];
  //get requested page name
  let template = file_parts[0].toLowerCase();

  if( !templates.hasOwnProperty( template ) ) {
    template = "home";
  }
  if( template != "home" ) data_to_send.nav[ template ] = true;

  console.log("Thanks for shopping ::", data_to_send);
  return bro.get(true, template_manager.executeTemplate( templates[template], data_to_send ));
}

module.exports.router = routeRequest;
