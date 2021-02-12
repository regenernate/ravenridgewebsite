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
var templates = {};
var pages = { home:{
  template:'./services/content/views/newsletter_home.handlebars',
  title:'This is the newsletter homepage!',
  desc:'The RavenRidge family farm newsletter is intended to provide important information about regenerative health and agriculture.'
  },
  newsletter:{
    template:'./services/content/views/newsletter_view.handlebars',
    title:'This is the default newsletter title',
    desc:'This is a description for this newsletter.'
  }
};

compileTemplates();
//this method is called after pages.json loads
function compileTemplates(){
  //extract just template name/path pairs for template manager to compile from
  for( var i in pages ){
    templates[i] = pages[i].template;
  }
  template_manager.compileTemplates(templates, true);
}

const dib_token = "b=HVGYH9CBTW48PTWHQ2ET";
const SUCCESS = "success";
var newsletter_list = [{slug:'january-2021', title:'January 2021 - Now introducing ...'},{slug:'february-2021', title:'February 2021 - The hard side of farming.'}];
var sections={};

loadNewsletterPosts();

async function loadNewsletterPosts(){
  let json;
  try {
    let response = await fetch('https://api.dropinblog.com/v1/json/?' + dib_token + '&category=newsletter');
    json = await response.json();
    if(json && json.status == SUCCESS ){
    //  console.log(sections);
      if( !await constructEditions( json.data.posts ) ){
        throw new Error("Newsletter :: Couldn't constructEditions");
      }
      //now we need to load the content for this newsletter

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

async function constructEditions( content ){
  try{
    for( let i=0; i<newsletter_list.length; i++ ){
      //initialize the sections of this newsletter edition
      newsletter_list[i].sections = { narrative:"", "our-backyards":"", "regenerative-health":"" };
      //get this editions slug for quick access
      let this_edition = newsletter_list[i].slug;
      sections[ this_edition ] = {};
      //find the sections of this edition
      for( let j in content ){
  //      console.log("looking for ", this_edition );
        let belongs = false;
        //check categories to see if this content belongs in the current newsletter
        for( let k=0; k<content[j].categories.length; k++ ){
          //strip off the "newsletter-" part
          let tmp_slug = content[j].categories[k].slug.split("-");
          if( tmp_slug[0] == "newsletter" ) tmp_slug.shift();
          let section = tmp_slug.join("-");
          if( !section ) continue; //skip the base "newsletter" category
  //        console.log("   is there a ", section);
          if( !belongs && section == this_edition ){ //this is the newsletter category and matches the current edition
            belongs = true;
  //          console.log("Yayy!!! it belongs");
            k = -1; //reset counter since we now know this content belongs to the edition we are looking for
            continue;
          }else if( belongs ){ //this is one of the subsection categories OR the base "newsletter" category which can be ignored
            if( newsletter_list[i].sections.hasOwnProperty( section ) ){
  //            console.log("   we found it!!!!");
              newsletter_list[i].sections[ section ] = content[j];
              //load this actual content
              let fsc = 'https://api.dropinblog.com/v1/json/post/?' + dib_token + "&post=" + content[j].slug;
              let response = await fetch(fsc);
              json = await response.json();
              if(json && json.status == SUCCESS ) sections[ this_edition ][ section ] = json.data;
              else console.log( "Newsletter Router could not load post ", content[j].slug );
            }
          }
        }
      }
  //    console.log( "list of newsletters :: ",  newsletter_list );
  //    console.log( "list of content :: ", sections );
    }
  }catch(err){
    console.log("Newsletter :: constructEditions failed", err);
    return false;
  }
  return true;
}

async function rebuildNewsletters(){
  let old_nl = newsletter_list;
  let old_sections = sections;
  if( !( await loadNewsletterPosts() ) ){
    newsletter_list = old_nl;
    sections = old_sections;
    return false;
  }
  return true;
}

//write a method to handle route requests and return a bro
async function routeRequest( request, response, file_parts ){
  let rtn = null;
  let template;
  let data_to_send = {nav:{newsletter:true}};
  //use default error message for now
  if( !file_parts || !file_parts.length ){
    file_parts[0] = "home";
  }
  if( file_parts[0] == "reload" ){
    let s = await rebuildNewsletters();
    return bro.get(true, template_manager.executeTemplate( null, data_to_send, template_manager.none_route) );
  }
  data_to_send.newsletters = newsletter_list; //send the list of newsletters to every page in this domain
  if( file_parts[0] == "home" || !sections.hasOwnProperty( file_parts[0] ) ){
    template = "home";
  }else{
    template = "newsletter";
    data_to_send.title = "January 2021 - Introducing the newsletter."
    data_to_send.sections = sections[ file_parts[0] ];
  }
  rtn = bro.get(true, template_manager.executeTemplate( templates[template], data_to_send ) );
  return rtn;
}

module.exports.router = routeRequest;
