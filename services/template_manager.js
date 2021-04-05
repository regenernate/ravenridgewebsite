const fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');


handlebars.registerHelper('equals', function (value, compare) {
  return value == compare;
});


handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

    var operators, result;

    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }

    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }

    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };

    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

/*
handlebars.registerHelper("everyOther", function (index, amount, scope) {
    if ( ++index % amount)
        return scope.inverse(this);
    else
        return scope.fn(this);
});
*/

//compile each of the templates sent
function compileTemplates( templates, replace ){
//  console.log("compileTemplates :: ", templates);
  var ret = ( replace ? templates : {} );
  //todo :: probably should change this call to be asynchronous
  for( var i in templates ){
    ret[i] = handlebars.compile( fs.readFileSync( templates[i], 'utf-8' ) );
  }
  return ret;
}

function loadComponentScripts( directories ){

}

//compile and register partials
handlebars.registerPartial('head', handlebars.compile( fs.readFileSync( "./views/shared/head.handlebars", 'utf-8' )));
handlebars.registerPartial('newsletter_signup', handlebars.compile( fs.readFileSync( "./views/shared/newsletter_signup.handlebars", 'utf-8' )));
handlebars.registerPartial('post_list', handlebars.compile( fs.readFileSync( "./views/shared/post_list.handlebars", 'utf-8' )));
handlebars.registerPartial('visit_shop', handlebars.compile( fs.readFileSync( "./views/shared/visit_shop.handlebars", 'utf-8' )));
handlebars.registerPartial('navigation', handlebars.compile( fs.readFileSync( "./views/shared/navigation.handlebars", 'utf-8' )));
handlebars.registerPartial('mtw_navigation', handlebars.compile( fs.readFileSync( "./views/shared/mtw_navigation.handlebars", 'utf-8' )));
handlebars.registerPartial('footer', handlebars.compile( fs.readFileSync( "./views/shared/footer.handlebars", 'utf-8' )));
handlebars.registerPartial('fda_approved', handlebars.compile( fs.readFileSync( "./views/shared/fda_approved.handlebars", 'utf-8' )));

//load and compile layout templates
var default_layout = "logged_out";
const layouts = compileTemplates( {  "none":"./views/layouts/none.handlebars", "unsupported":"./views/layouts/unsupported.handlebars", "logged_out":"./views/layouts/logged_out.handlebars"} );

module.exports.unsupported_route = layouts.unsupported;
module.exports.none_route = layouts.none;
module.exports.compileTemplates = compileTemplates;

/********

data should be an object with specific variables to be sent to the source template ... the main of the page being rendered

*******/

module.exports.executeTemplate = function( source, data, layout ){
  if( !layout ) layout = default_layout;
  else if( !layouts.hasOwnProperty( layout ) ){
    console.log("TemplateManager :: There is no layout ", layout);
    layout = "none";
  }
  if( !data ){
    console.log("There was a call to template_manager with no nav data sent ... what do I do?");
    throw new Error("There was a call to template_manager with no nav data sent ... what do I do?");
    data = {};
  }

  if( !source ) source = function(data){ return data; }
//  console.log("executeTemplate() : ", source, data, layout );
//  console.log(data);
  var template_value;

  try{
    cleanDatesForDisplay(data);
    template_value = layouts[ layout ]( { body:source(data), nav:data.nav, title:data.title, description:data.description });
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
