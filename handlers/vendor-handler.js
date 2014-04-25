var dbmanager = require(__dirname + "/../dbmanager.js");

exports.vendorPage = function(request, response, next) {
    if (vendorName !== "" && vendorName !== "forms" && vendorName !== "search" && vendorName !== "favicon.ico") {
	var vendorName = request.body.vendorName;
	var db = dbmanager.getDb();
	db.collection('vendors').findOne({'name' : vendorName}, function(err, vendorData) {
            if (vendorData === null)
		next(Error("Invalid vendor name"));
            else
		response.render('content-page.html', vendorData);
	});
    }
};