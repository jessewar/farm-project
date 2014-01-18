var dbmanager = require(__dirname + '/dbmanager.js');

function setHandlers(app) {
    // load home page
    app.get('/', function(request, response) {
	response.render('index.html');
    });

    // load content page
    app.get('/content', function(request, response) {
	// Find one document in our collection
	dbmanager.getDb().collection('farm').findOne({}, function(err, doc) {
	    if(err) throw err;
	    response.render('content-page.html', doc);
	});
    });

    // load forms page
    app.get('/forms', function(request, response) {
	response.render('forms.html');
	console.log("form page request made");
    });

    // handles forms page input post data
    app.post('/content', function(request, response) {
	console.log(request.body);
	var db = dbmanager.getDb();
	var formData = request.body;
	var name = formData.farmName;

	// grabs the password associated with farmName and adds it back into the new form data so that it is
	// not lost when the db is updated (bc password is not included on the forms page)
	db.collection('farm').findOne({farmName: name}, function(err, data) {
	    if(err) throw err;
	    formData.password = data.password;  // add the password to the new form data that will be input into the db

	    // look for a db entry with a farmName value of "name"
	    // if one does not exist, insert one along with the other values within request.body
	    // if one does exist, update it's attribute values to those contained in request.body
	    db.collection('farm').update({farmName: name}, formData, {upsert: true}, function(err, data) {
		if(err) throw err;
		console.log("successfully inserted: " + JSON.stringify(data));
		response.end(); // needed to tell client that the POST was successful
	    });
	});
    });

    // handles password post data
    app.post('/forms', function(request, response) {
	var userPassword = request.body.password;
	console.log("password was: " + userPassword);

	var db = dbmanager.getDb();
	db.collection('farm').findOne({password: userPassword}, function(err, doc) {
	    if(err) throw err;

	    console.log(doc);
	    response.send(doc);
	});
    });

    // load any particular content page
    app.get('/*', function(request, response, next) {
	var pageName = request.params[0];  // the string that corresponds to the "*"
	console.log("totototo" + pageName);
	if (pageName !== "" && pageName !== "forms" && pageName !== "favicon.ico") {  // only enter when request is a content page
	    var db = dbmanager.getDb();
	    db.collection('farm').findOne({'farmName': pageName}, function(err, doc) {
		if(err) throw err;
		if (doc === null) {
		    next(Error("invalid content page"));  // lets the errorHandler function of server.js handle the error
		} else {
		    console.log(doc);
		    response.render('content-page.html', doc);
		}
	    });
	}
	console.log(pageName);
	console.log(typeof pageName);
    });
}

exports.setHandlers = setHandlers;
