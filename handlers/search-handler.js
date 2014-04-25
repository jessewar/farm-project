var dbmanager = require(__dirname + "/../dbmanager.js");

exports.searchPage = function(request, response) {
    response.render("search.html");
};

exports.makeSearch = function(request, response) {
    var searchNameRequest = request.body.name;
    
    var db = dbmanager.getDb();
    var Market = dbmanager.getMarketModel();

    console.log(searchNameRequest);
    Market
    	.find()
    	.where('name').equals(searchNameRequest)
    	.exec(function(error, results) {
    	    if (error) {
    		console.log(error);
    	    } else {
    		response.send(results);
    	    }
    	});
};

