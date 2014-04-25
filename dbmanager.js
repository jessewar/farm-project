var Server = require('mongodb').Server;
var Db = require('mongodb').Db;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var database;
var Market;

function init() {
    mongoose.connect('mongodb://heroku_app21367711:u7jj78qq5hqredp969nn7rv6b7@ds053798.mongolab.com:53798/heroku_app21367711');
    
    database = mongoose.connection;
    database.once('open', function() {
	var marketSchema = new Schema({name : String});
	Market = mongoose.model('Market', marketSchema);
	// var market1 = new Market({name : "MYMARKET"});
	// market1.save(function(err, market1) {
	//     if (err) return console.error(err);
	//     console.log(market1.name);
	// });
    });
}

function getDb() {
  return database;
}

function getMarketModel() {
    return Market;
}

exports.init = init;
exports.getDb = getDb;
exports.getMarketModel = getMarketModel;