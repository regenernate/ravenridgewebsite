require('dotenv').config();

//if (process.env.NODE_ENV && process.env.NODE_ENV=='development')
//  process.env.DB_NAME = "rrhhtest";

var mysql = require('mysql');
var migration = require('mysql-migrations');
var state = {pool:null};

var connect = function(done) {
  try{
    if(process.env.NODE_ENV && process.env.NODE_ENV=='development'){

      state.pool = mysql.createPool(
        {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
    }
    else {
      state.pool = mysql.createPool(process.env.DATABASE_URI);
    }
    done();
  }catch(err){
    console.log(err.message);
  }
}

connect(
function(err) {
    if (err) {
      console.log('Unable to connect to MySQL.');
      process.exit(1);
    } else {
      migration.init(state.pool, __dirname + '/migrations');
    }
  }
);
