var dbmanager = require(__dirname + "/dbmanager.js");
var home = require(__dirname + "/handlers/home-handler.js");
var markets = require(__dirname + "/handlers/markets-handler.js");
var search = require(__dirname + "/handlers/search-handler.js");
var forms = require(__dirname + "/handlers/forms-handler.js");
var vendors = require(__dirname + "/handlers/vendor-handler.js");

function setHandlers(app) {
    app.get("/", home.frontpage);

    app.get("/markets", markets.marketsList);
    app.get("/markets/:marketName", markets.market);
    app.get("/markets/:marketName/:vendorName", vendors.vendorPage);

    app.get("/search", search.searchPage);
    app.post("/search", search.makeSearch);

    app.get("/forms", forms.formsPage);
    app.post("/forms", forms.validatePassword);

    // handles forms page input post data
    app.post('/content', function(request, response, next) {
        var db = dbmanager.getDb();
	var formData = request.body;  // newly updated vendor content

        // grabs the password associated with farmName and adds it back into the new form data so that it is
        // not lost when the db is updated (bc password is not included on the forms page)
        db.collection('vendors').findOne({name : formData.name}, function(err, vendorData) {
            if(err) throw err;
            formData.password = vendorData.password;  // add the password to the new form data that will be input into the db

            // look for a db entry with a farmName value of "name"
            // if one does not exist, insert one along with the other values within request.body
            // if one does exist, update it's attribute values to those contained in request.body
            db.collection('vendors').update({name : formData.name}, formData, {upsert: true}, function(err, data) {
                if(err) next(Error("Error updating database"));

                response.end(); // needed to tell client that the POST was successful
            });
        });
    });

//    app.get("/*", vendors.vendorPage);
}

exports.setHandlers = setHandlers;
