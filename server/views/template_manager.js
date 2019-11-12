const fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');
var default_navigation;

handlebars.registerHelper("everyOther", function (index, amount, scope) {
    if ( ++index % amount)
        return scope.inverse(this);
    else
        return scope.fn(this);
});

//compile each of the templates sent
function compileTemplates( templates, replace ){
  var ret = ( replace ? templates : {} );
  //todo :: probably should change this call to be asynchronous
  for( var i in templates ){
    ret[i] = handlebars.compile( fs.readFileSync( templates[i], 'utf-8' ) );
  }
  return ret;
}
//compile the components sent
function compileComponents( components, replace ){
  var ret = ( replace ? components : {} );
  for( var i in components ){
    ret[i] = handlebars.compile( fs.readFileSync( components[i], 'utf-8' ) );
  }
  return ret;
}

function loadComponentScripts( directories ){

}

/*
//load any navigation elements from config
fs.readFile("./config/navigation.json", function(error, content) {
    if (error) {
      console.log("server error :: " + error.message);
    } else {
//      configured_navigation = JSON.parse(content);
      setNavigation(JSON.parse(content));
    }
});

function setNavigation( nav ){
  default_navigation = nav.navigation;
}

handlebars.registerPartial('mainnavigation', handlebars.compile( fs.readFileSync( "./server/views/mainnavigation.handlebars", 'utf-8' )))
handlebars.registerPartial('footer', handlebars.compile( fs.readFileSync( "./server/views/footer.handlebars", 'utf-8' )));
*/
handlebars.registerPartial('header', handlebars.compile( fs.readFileSync( "./server/views/header.handlebars", 'utf-8' )));


//load and compile layout templates
//"logged_in":"./server/views/logged_in.handlebars", "logged_out":"./server/views/logged_out.handlebars",
const layouts = compileTemplates( {  "none":"./server/views/none.handlebars", "logged_in":"./server/views/logged_in.handlebars"} );
//need to activate system that will track compiled components and ensure the proper script files are loaded.
//const component_scripts = loadComponentScripts( ["./content/components/scripts.handlebars"] );

module.exports.compileTemplates = compileTemplates;
module.exports.compileComponents = compileComponents;

module.exports.executeTemplate = function( source, data, layout ){
  if( !layout ) layout = "none";
  else if( !layouts.hasOwnProperty( layout ) ){
    console.log("TemplateManager :: There is no layout ", layout);
    layout = "none";
  }
  if( !data ) data = {};
  if( !source ) source = function(data){ return data; }
//  console.log("executeTemplate() : ", source, data, layout );
//  console.log(data);
  var template_value;
  try{
    cleanDatesForDisplay(data);
    console.log(data);
    template_value = layouts[ layout ]( { body:source(data) });
  }catch(err){
    console.log("template_manager.executeTemplate :: ", err.message);
  }
  return template_value;
}

function cleanDatesForDisplay( d ){
  for( var i in d ){
    if( typeof d[i] === 'object' && !Array.isArray(d[i]) ){
      cleanDatesForDisplay( d[i] ); //call again with new object
    }else if( Array.isArray(d[i]) ){ //for actual arrays, check if any items are objects
      let a = d[i];
      for( var j in a ){ //look for objects in this array
        if( !Array.isArray(a[j]) && typeof a[j] === 'object'){
          cleanDatesForDisplay( a[j] );
        }
      }
    }else{
      if( i.indexOf('date') > -1 ){
        d[i] = formatDateForDisplay( i, d[i] );
      }
    }
  }
//  return source( data );
}

function formatDateForDisplay( date_name, ms ){
  //let r_date = moment( ms, 'x' ).format('MM-DD-YYYY [at] HH:MM');
  //console.log("formatDatesForDisplay converted " + date_name + " from " + ms + " to " + r_date);
  //return r_date;
  return moment( ms, 'x' ).format('MM-DD-YYYY [at] HH:MM');
}
