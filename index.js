require('dotenv').config();

const http_server = require('./server/server_v2.js');

//when no base path is sent, default_router will be used
const default_router_path = "content";

var port = process.env.PORT;
var ip = process.env.BIND_IP;

if( !port || !ip ){
  console.log("Don't forget to set your .env file and define a port and ip.");
}

var configured_routers = { };
var modules_to_load = {
                      "content_router":true,
                      "purchasing_router":true,
                      "user_router":true,
                      "product_testing_router":true
                    };

//pull this out into /services/router_config.json
var routers_to_load = [ {name:"content_router", path:"../services/content/" }, {name:"purchasing_router", path:"../services/purchasing/"}, {name:"user_router", path:"../services/user/"}, {name:"product_testing_router", path:"../services/product_testing/"}];

function loadRouters(){
  //loadConfiguredRoutes('./server/routers/', './routers/');
  for( let i in routers_to_load ){
    http_server.addRouter( routers_to_load[i].name, routers_to_load[i].path );
  }
  http_server.setDefaultRouter( default_router_path );
}

try{
  loadRouters();
  http_server.startServer(port, ip);
}catch(err){
  console.log( "there was an error loading a configured router", err.message );
}


/*mysql database
var db = require('./database/mysql2_db.js');

db.connect(function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.');
    process.exit(1)
  } else {
    initHttpServer();
  }
}); */
