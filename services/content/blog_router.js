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

var post_categories;
var post_list;
var pinned_list;

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
      //remove newsletter categories for now since the api doesn't allow us to exclude a category
      for( let cat=post_categories.length-1; cat>=0; cat-- ){
        if( post_categories[cat].slug.indexOf("newsletter") >= 0 ) post_categories.splice( cat, 1 );
      }
    }else{
      throw new Error("Blog Posts category call failed");
    }
    response = await fetch('https://api.dropinblog.com/v1/json/?' + dib_token + "&limit=20");
    json = await response.json();
    if(json && json.status == SUCCESS ){
      post_list = json.data.posts;
      let cat_fnd;
      //remove posts with any newsletter related category
      for( let pos=post_list.length-1; pos>=0; pos--){
        //remove any posts with a newsletter category
        cat_fnd = false;
        for( let categ in post_list[pos].categories ){
          if( post_list[pos].categories[categ].slug.indexOf("newsletter") >= 0 ){
            cat_fnd = true;
            break;
          }
        }
        if(cat_fnd) post_list.splice( pos, 1 );
      }
      pinned_list = getPinnedPosts( post_list );
      buildPostsByCategory( post_list );
    }else{
      throw new Error("Remote blog posts call failed");
    }
//    console.log(post_listing);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

function buildPostsByCategory( posts ){
  for( let c in post_categories ){
    let cat = post_categories[c].slug;
    let plist = [];
    for( let i=0; i<posts.length; i++){
      for( let j in posts[i].categories ){
        if( posts[i].categories[j].slug == cat ){
          plist.push(posts[i]);
          break;
        }
      }
    }
    post_categories[c].posts = plist;
  }
}

function getPinnedPosts( posts ){
  let pp = [];
  for( let p in posts ){
    if( posts[p].pinned ) pp.push( posts[p] );
  }
  return pp;
}

async function rebuildPosts(){
  let old_posts = post_list;
  let old_cats = post_categories;
  let old_pins = pinned_list;
  if( !( await loadBlogPosts() ) ){
    post_list = old_posts;
    post_categories = old_cats;
    pinned_list = old_pins;
    return false;
  }
  return true;
}

async function loadPost( slug ){
  let json;
  try{
    let url = 'https://api.dropinblog.com/v1/json/post/?' + dib_token + "&post=" + slug;
    let response = await fetch(url);
    json = await response.json();
    if(json && json.status == SUCCESS ) return json.data;
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
  let dts = {nav:{blog:true}}
  let content={ posts:post_list, posts_by_category:post_categories };
  if( !file_parts || !file_parts.length ) file_parts = ['home'];
  if( file_parts[0] == "reload" ){
    let s = await rebuildPosts();
    return bro.get(true, template_manager.executeTemplate( null, {content:content}, template_manager.none_route) );
  }
  if( templates.hasOwnProperty( file_parts[0] )){
    route = file_parts[0];
    dts.title = pages[route].title;
    dts.description = pages[route].description;
  }else{
    let p = await loadPost(file_parts[0]);
    if( p ){
      route = "post";
      content.posts = getSomePosts( 2, p.post ); //override full post list with two other posts for now
      content.post = p.post;
      dts.title = p.headTitle;
      dts.description = p.headDescription;
    }else{
      route = "home";
      dts.title = pages[route].title;
      dts.description = pages[route].description;
    }
  }
  //use default error message for now
  dts.content = content;
  rtn = bro.get(true, template_manager.executeTemplate( templates[route], dts ) );
  return rtn;
}

//method to return the pinned items
function blogLister(){
  if( pinned_list && pinned_list.length ){
    return pinned_list;
  }
  else return false;
}

//method to return two posts that arent the post sent
function getSomePosts( count, avoid ){
  if( !count ) count = 2; //initialize to two posts if no number of posts sent
  if( !avoid ) avoid = {slug:"whatwhat"}; //initialize to a non-likely slug in case of no avoid list sent
  let rtn = [];
  for( let i in post_list ){
    if( post_list[i].slug == avoid.slug ) continue;
    else rtn.push(post_list[i]);
    if( rtn.length == count ) break;
  }
  return rtn;
}

module.exports.router = routeRequest;

module.exports.blog_lister = blogLister;
