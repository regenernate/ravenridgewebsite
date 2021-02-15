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

var pricing = {
  salve:[
    {
      strength:"1%",
      sizes:[
        {
          size:"1", total_cbd:"300", full_price:"42", subscription_price:"35", full_mg_price:".14", subscription_mg_price:".12"
        },
        {
          size:"2", total_cbd:"600", full_price:"56", subscription_price:"48", full_mg_price:".09", subscription_mg_price:".08"
        },
        {
          size:"4", total_cbd:"1200", full_price:"88", subscription_price:"76", full_mg_price:".07", subscription_mg_price:".06"
        }
      ]
    },{
      strength:"2%",
      sizes:[
        {
          size:"1", total_cbd:"600", full_price:"50", subscription_price:"42", full_mg_price:".08", subscription_mg_price:".07"
        },
        {
          size:"2", total_cbd:"1200", full_price:"88", subscription_price:"74", full_mg_price:".07", subscription_mg_price:".06"
        },
        {
          size:"4", total_cbd:"2400", full_price:"130", subscription_price:"110", full_mg_price:".054", subscription_mg_price:".046"
        }
      ]
    }
  ],
  sublingual:[
    {
      strength:"1%", total_cbd:"300", full_price:"28", subscription_price:"24", full_mg_price:".09", subscription_mg_price:".08"
    },
    {
      strength:"2%", total_cbd:"600", full_price:"42", subscription_price:"36", full_mg_price:".07", subscription_mg_price:".06"
    },
    {
      strength:"3%", total_cbd:"900", full_price:"56", subscription_price:"48", full_mg_price:".06", subscription_mg_price:".05"
    },
    {
      strength:"4%", total_cbd:"1200", full_price:"65", subscription_price:"56", full_mg_price:".054", subscription_mg_price:".047"
    }
  ]
}

async function routeRequest( request, response, file_parts ){
  let data_to_send = { nav:{shop:true}, title:pagetitle, desc:pagedesc};

  let rtn = null;
  //if no page name, use default template
  if( !file_parts || file_parts.length == 0 ) file_parts = [ "home" ];
  //get requested page name
  let template = file_parts[0].toLowerCase();

  if( !templates.hasOwnProperty( template ) ) {
    template = "home";
  }
  if( template != "home" ){
    data_to_send.nav[ template ] = true;
    data_to_send.pricing = pricing[template];
  }else{
    data_to_send.pricing = pricing;
  }

//  console.log("Thanks for shopping ::", data_to_send);
  return bro.get(true, template_manager.executeTemplate( templates[template], data_to_send ));
}

module.exports.router = routeRequest;
