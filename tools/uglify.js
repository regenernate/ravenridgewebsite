/* simple helper to manage uglifying css automatically whenever css files change in the supplied directory
limitations:

1. must be running
2. list of css files to watch must be provided in order desired

*/


const fs = require("fs");
const uglifycss = require( 'uglifycss' );

var basepath = "../views/css/";
var uglified_filename = "css_uglified.css";
var css_files = [ "reset", "colors", "main", "fonts-and-margins", "images" ];

for ( let i in css_files ){
  css_files[i] = basepath + css_files[i] + ".css";
}

function uglify(){
  var uglified_css = uglifycss.processFiles( css_files, {maxLineLen: 500} );
  fs.writeFile( basepath + uglified_filename, uglified_css, 'utf8', ()=>{ console.log("css uglified"); } );
}

//set up listeners for css file changes
fs.watch(basepath, (event, filename) => {
  if (filename) {
    if( filename != uglified_filename ){
      uglify();
    }
  }
});

/*

var uglifycss = require('uglifycss');

var uglified = uglifycss.processFiles(
    [ './views/css/ ],
    { maxLineLen: 500, expandVars: true }
);

console.log(uglified);

*/
