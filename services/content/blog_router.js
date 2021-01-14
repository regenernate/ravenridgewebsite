/****

The PURPOSE of this router is to handle requests for a set of mostly static content.
It defines a set of templates which correlate to specific urls.
It is used here to load the general information pages for the RRHH website

****/


const fs = require('fs');

const fetch = require('node-fetch');

//The server will load active routers and if a request comes in with the base_route_path as specified below,
//the server will call the defined router method as below, passing along the request and response objects,
//and an array of the remaining url parts as separated by "/"
//any querystring will have been removed from the file_parts array but is available as request.query

//this variable controls whether or not this router gets loaded
module.exports.active = true;

//The server expects a basic return object or an error to be thrown
//load the basic return object prototype
var bro = require("../../server/bro");
//load any controllers needed to handle requests
var template_manager = require('../../services/template_manager');


//this variable will hold the pre-compiled template functions for whatever pages are loaded in pages.json
var templates = {};
var pages = { home:{
  template:'./services/content/views/blog_home.handlebars',
  title:'This is the blog homepage!',
  desc:'The RavenRidge family farm blog is far reaching, but mostly about remembering our place on the planet we call home.'
  },
  post:{
    template:'./services/content/views/blog_post.handlebars',
    title:'This is the default post title',
    desc:'This is a description for this post.'
  }
};


const dib_token = "b=HVGYH9CBTW48PTWHQ2ET";
const SUCCESS = "success";

var post_categories = [];
var post_listing = [];

compileTemplates();
loadBlogPosts();
//this method is called after pages.json loads
function compileTemplates(){
  //extract just template name/path pairs for template manager to compile from
  for( var i in pages ){
    templates[i] = pages[i].template;
  }
  template_manager.compileTemplates(templates, true);
}

async function loadBlogPosts(){
  let json;
  try {
    let response = await fetch('https://api.dropinblog.com/v1/json/categories/?' + dib_token);
    json = await response.json();
    if(json && json.status == SUCCESS){
      post_categories = json.data;
    }
    response = await fetch('https://api.dropinblog.com/v1/json/?' + dib_token);
    json = await response.json();
    if(json && json.status == SUCCESS ){
      post_listing = json.data.posts;
    }
//    console.log(post_listing);
  } catch (error) {
    console.log(error);
  }
}

async function loadPost( slug ){
  let json;
  try{
    let url = 'https://api.dropinblog.com/v1/json/post/?' + dib_token + "&post=" + slug;
    console.log(url);
    let response = await fetch(url);
    json = await response.json();
    if(json && json.status == SUCCESS ) return json.data.post;
    else return false;
  }catch(error){
    console.log('loadPost :: ', error);
    return false;
  }
}

//write a method to handle route requests and return a bro
async function routeRequest( request, response, file_parts ){
  let rtn = null;
  let route;
  let content={ categories:post_categories, posts:post_listing };
  if( !file_parts || !file_parts.length ) file_parts = ['home'];
  if( templates.hasOwnProperty( file_parts[0] )) route = file_parts[0];
  else{
    let p = await loadPost(file_parts[0]);
    if( p ){
      route = "post";
      content.post = p;
    }else{
      route = "home";
    }
  }
  //use default error message for now
  rtn = bro.get(true, template_manager.executeTemplate( templates[route], {nav:{blog:true}, content:content, title:pages[route].title, description:pages[route].desc} ) );
  return rtn;
}

module.exports.router = routeRequest;
