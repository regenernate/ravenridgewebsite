require('dotenv').config(); //load local environmental variables, or default to production settings

const http_server = require('./server/server_v2.js'); //load the http server that will handle our request traffic


const default_router_path = "content"; //when no base path is sent in a request, this path will be used instead of the empty string

var port = process.env.PORT;
var ip = process.env.BIND_IP;

//give a little help, if needed
if( !port || !ip ){
  console.log("Don't forget to set your .env file and define a port and ip.");
}

//load routers from config
let {loadData} = require( "./tools/filesys/filesys_util");

var routers_to_load = loadData("./config/routers.json");

loadData = null;


//method to load the configured routers
function loadRouters(){
  for( let i in routers_to_load ){
    http_server.addRouter( i, routers_to_load[i] ); //add the configured router to the server
  }
  http_server.setDefaultRouter( default_router_path ); //define the default path to use for unhandled requests
}

//actually try to load those suckers ... the routers ... the one's you configured above ... remember ...
try{
  loadRouters();
  http_server.startServer(port, ip); //actually start the server
}catch(err){
  console.log( "there was an error loading a configured router", err.message ); // uh-oh
}
