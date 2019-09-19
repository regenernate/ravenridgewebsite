module.exports.base_route_path = "products";
//this variable controls whether or not this router gets loaded
module.exports.active = false;


var bro = require("../../server/bro");
var template_manager = require('../../server/views/template_manager');

/** define templates here for use in request routing **/
var templates = template_manager.compileTemplates({
});
/** define unique components that are used by this set of routes **/
var components = template_manager.compileComponents({
  "image_and_text":"./content/components/image_and_text_view.handlebars",
  "call_to_action":"./content/components/call_to_action.handlebars"
}, true);

var routes = {
  get : {
  },
  post : {
  }
}

async function routeRequest( request, response, file_parts ){
  console.log(components);
  if(!file_parts.length)
//    return bro.get(true, template_manager.executeTemplate(templates.index));
    return bro.get(true, template_manager.executeTemplate(components.image_and_text,
        {
        sidebyside:true,
        data:[
              {text_content:'Our products are made in small batches, on premises, from fresh processed flower grown using regenerative methods.', image_content:'./content/assets/white-image.png'},
              {text_content:'We really care about how we grow our plants. Do you?', image_content:'./content/assets/white-image.png'},
              {text_content:'Regenerative Agriculture is where it\'s at for us, and soil health is the name of the game.', image_content:'./content/assets/white-image.png'}
            ]
        }
      )
    );
  let lookup = routes[ String(request.method).toLowerCase() ];
  if( lookup.hasOwnProperty( file_parts[0] ) ){
    let routed_call = await lookup[ file_parts[0] ]( request, response );
    return routed_call;
  }else{
    return bro.get(false, null, "There is no implementation of " + file_parts[0] + " in about_router.");
  }
}

module.exports.router = routeRequest;
