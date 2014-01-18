var Server = require('mongodb').Server;
var Db = require('mongodb').Db;

var database;

function init() {
  var options = {safe: true};
  var server = new Server("ds041198.mongolab.com", 41198, options); // ip address 10.226.119.215
  var db = new Db('heroku_app17145481', server);
  
  // db and n_db are references to the exact same thing (I think)
  db.open(function(err, n_db) {
    if(err) throw err;

    db.authenticate("jessewar", "lemonlime1", function(err, success) {
      database = n_db;
    });
  });
}

function getDb() {
  return database;
}

exports.init = init;
exports.getDb = getDb;
