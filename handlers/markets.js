var dbmanager = require(__dirname + "/../dbmanager.js");

/*
  Render the market-list template with the list of all markets available
*/
exports.marketsList = function(request, response) {
    response.render("markets-list.html");
};

/*
  Render the market.html template with the document associated with marketName
*/
exports.market = function(request, response, next) {
    var db = dbmanager.getDb();
    var target = {name : request.params.marketName};
    db.collection('markets').findOne(target, function(err, doc) {
        if (doc === null) next();
        response.render("market.html", doc);
    });
};

/*
  Displays webpage for markets not contained within the database
*/
exports.marketNotFound = function(request, response) {
    response.send("Error: " + request.params.marketName + " is not a valid market");
};



// exports.vendor = function(request, response) {

// };