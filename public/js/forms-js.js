$(document).ready(function() {
    configureAjax();
    promptForPassword();
    submitClicked();
});

// add detailed error messages if an AJAX request fails
function configureAjax() {
    // ajax default error handling function
    $.ajaxSetup({
	error: function(jqXHR, exception) {
	    if (jqXHR.status === 0) {
		alert('Not connect.\n Verify Network.');
	    } else if (jqXHR.status == 404) {
		alert('Requested page not found. [404]');
	    } else if (jqXHR.status == 500) {
		alert('Internal Server Error [500].');
	    } else if (exception === 'parsererror') {
		alert('Requested JSON parse failed.');
	    } else if (exception === 'timeout') {
		alert('Time out error.');
	    } else if (exception === 'abort') {
		alert('Ajax request aborted.');
	    } else {
		alert('Uncaught Error.\n' + jqXHR.responseText);
	    }
	}
    });
}

// create message box asking the user for a passcode
function promptForPassword() {
    // function to be called upon completing ajax post request
    var helper = function(doc) {
	if (doc === null) {
	    alert("password is invalid, please try again");
	} else {
	    // get the pieces of the document
	    var name = doc.farmName;
	    var types = doc.farmTypes;

	    // fill in the name textbox
	    $('#farm-name-textbox').text(name);

	    // TODO: uncheck boxes prior to doing this. If modify one page, press back, then enter different password last modifcations show up
	    // check the appropriate checkboxes
	    for (var i = 0; i < types.length; i++) {
		$('#' + types[i]).prop('checked', true);
	    }

	    alert("post successful" + JSON.stringify(doc));
	    Apprise('close');
	}
    };

    var options = {
	animation: 700, // Animation speed
	buttons: {
	    confirm: {
		action: function(e) {
		    var input = e.input;
		    var doc = { 'password': input };
		    // make a post request with the data contained in the forms
		    $.ajax({
			'url': '/forms',
			'type': 'POST',
			'dataType': 'json', // the datatype of the data sent back from the server to the client
			'data': doc
		    })
			.done(helper);
		},
		className: 'password', // Custom class name(s)
		id: 'confirm', // Element ID
		text: 'Submit', // Button text
	    }
	},
	input: true, // require input dialog
	override: true, // override browser navigation while Apprise is visible
    };

    Apprise('Please enter passcode:', options);
}

// create a POST request with the form data when the submit button is pressed
function submitClicked() {
    $('.btn').on('click', function() {
	var farmName = getFarmName();
	var farmTypes = getFarmTypes();

	var doc = {'farmName': farmName,
		   'farmTypes': farmTypes};

	// make a post request with the data contained in the forms
	$.ajax({
	    'url': '/content',
	    'type': 'POST',
	    'data': doc
	})
	    .done(function() { if (confirm("Success: your page has been modified\n\n Click ok to be redirected to your page")) {
		// redirects user to the related (newly modified) content page if he clicks "ok"
		// does nothing if presses cancel
		window.location = "/" + farmName;  // redirect to the content page related to this farm
	    }});
    });
}

// returns the name of the farm as a string
function getFarmName() {
    var farmName = $('#farm-name-textbox').text();

    return farmName;
}

// returns an array containing the types of goods a farm has available
function getFarmTypes() {
    var arr = $('#checkboxes :checked'); // array of checkboxes that were checked

    var farmTypes = [];
    for (var i = 0; i < arr.length; i++) {
	farmTypes[i] = arr[i].id;
    }

    return farmTypes;
}
