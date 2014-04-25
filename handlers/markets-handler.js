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
        if (doc === null) next(Error("Invalid market name"));
        response.render("market.html", doc);
    });
};


