var dbmanager = require(__dirname + '/dbmanager.js');
var server = require(__dirname + '/server.js');
var express = require('express');
var app = express();
var requestHandlers = require(__dirname + '/requestHandlers.js');

server.start(app); // open connection to the web server

requestHandlers.setHandlers(app) // define the request handlers for the app

dbmanager.init(); // open the connection to the db, only needs to happen once

