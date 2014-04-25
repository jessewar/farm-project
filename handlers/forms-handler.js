var dbmanager = require(__dirname + "/../dbmanager.js");

/*
  Loads the forms page
*/
exports.formsPage = function(request, response) {
    response.render('forms.html');
};

/*
  Sends back vendor data if the password exists in the db otherwise sends back null
*/
exports.validatePassword = function(request, response) {
    var userPassword = request.body.password;

    var db = dbmanager.getDb();
    db.collection('vendors').findOne({password : userPassword}, function(err, vendorData) {
        if(err) throw err;
        response.send(vendorData);
    });
};