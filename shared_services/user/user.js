
var {log} = require( '../../shared_services/logging/logger' );
var bro = require( '../../server/bro' );

var Cookies = require('cookies');
var keys = [process.env.COOKIE_KEY];
//load template manager and compile templates
var template_manager = require('../../server/views/template_manager')
var templates = template_manager.compileTemplates({
  "login":"./shared_services/user/views/login.handlebars"
});

//load user data, from hand-coded file for now
var fs = require('fs');
var users;
fs.readFile("./config/user/users.json", function(error, content) {
    if (error) {
      console.log("user_controller error :: " + error.message);
    } else {
      log(); //initialize logger
      users = JSON.parse(content);
    }
});

var default_user = {id:0, name:"Default User"};

function loginForm(request, response){
  //uses the "logged_out" layout which removes jquery and all references to data.
  return bro.get( true, template_manager.executeTemplate( templates.login, {users:users.users}, 'logged_out' ) );
}

async function login( request, response ){
  let email = null;
  if( request.query && request.query.email ){
    email = request.query.email;
  }else if( request.body && request.body.email ){
    email = request.body.email;
  }else{
    return bro.get( false, null, "USER LOGIN :: No email was found.")
  }
  var ck = userExists( email );
  if( !ck ) return bro.get( false, null, "There is no record of user with email " + email );
  else{
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    tomorrow.setHours(6);
    var cookies = new Cookies(request, response, { keys:keys });
    cookies.set(process.env.COOKIE_NAME, ck.id, { signed:true, expires:tomorrow });
    request.user = ck;
    return bro.get( true, "The user has been logged in.");
  }
}

async function logout( request, response ){
  var cookies = new Cookies(request, response, {keys:keys});
  var expire_date = new Date();
  expire_date.setDate( expire_date.getDate()-1 );
  cookies.set(process.env.COOKIE_NAME, "expired", {expires: expire_date});
  return bro.get( true, "Thanks for visiting.", null, "/user/login/");
}

function userExists( email, id ){
  let ckname, ckvalue;
  if( id ){
    ckname = "id";
    ckvalue = id;
  }else{
    ckname = "email";
    ckvalue = email;
  }
  for( let i in users.users){
    if( users.users[i][ckname] == ckvalue ){
      return users.users[i];
      break;
    }
  }
  return null;
}

async function checkUser( request, response ){
  request.user = default_user;
  return bro.get( true, "Login is off!", null );
  let found = false;
  var cookies = new Cookies(request, response, { keys:keys })
  var user_cookie = cookies.get(process.env.COOKIE_NAME, { signed:true });
  if( !user_cookie ){
    return bro.get( false, null, "There is no logged in user.");
  }else{
    let u = userExists( null, user_cookie );
    if( !u ) return bro.get( false, null, "The logged in user cannot be found!" );
    else{
      request.user = u;
      return bro.get( true, "User is logged in.", null );
    }
  }
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.isValidUser = checkUser;
module.exports.getLoginForm = loginForm;
