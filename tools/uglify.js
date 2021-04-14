/* simple helper to manage uglifying css automatically whenever css files change in the supplied directory
limitations:

1. this helper must be running
2. list of css files to watch must be provided in order desired for uglified output

*/


const fs = require("fs");
const uglifycss = require( 'uglifycss' );

/*  ultimately pull this config data into external file ( i.e. data.json )  */
var basepath = "../views/css/"; //where to find css files to uglify and concatenate
var outpath = "../dist/"; //where to save uglified css file
var uglified_filename = "css_uglified.css"; //what filename to use for uglified file

//what filenames to look for in the basepath specified ( reduce hackiness-opportunity factor )
var css_files = [ "reset",
                  "colors",
                  "helper_classes",
                  "font-sizes",
                  "image-sizes",
                  "cbd-guides",
                  "main",
                  "main-home",
                  "main-why_ravenridge",
                  "main-meet_the_wheelers",
                  "main-newsletter",
                  "main-blog",
                  "nav",
                  "footer"
                ];
for ( let i in css_files ){
  css_files[i] = basepath + css_files[i] + ".css";
}

function uglify(){
  var uglified_css = uglifycss.processFiles( css_files, {maxLineLen: 500} );
  fs.writeFile( outpath + uglified_filename, uglified_css, 'utf8', ()=>{ console.log( "These files were just uglified: ", css_files ) } );
}

//set up listeners for css file changes
fs.watch(basepath, (event, filename) => {
//  console.log("potential css file change detected...");
  if (filename) {
//    console.log("file changed was :: ", filename);
    if( filename != uglified_filename && css_files.indexOf(basepath + filename) >= 0 ){
//      console.log("uglified from watcher");
      uglify();
    }
  }
});

//do initial uglification
//console.log("initial uglification");
uglify();
