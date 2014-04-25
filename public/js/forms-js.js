$(document).ready(function() {
    configureAjax();
    promptForPassword();
    $("#submit-form-btn").on('click', submitFormData);
});

// create message box asking the user for a passcode
function promptForPassword() {
    var options = {
        animation: 700, // Animation speed
        buttons: {
            confirm: {
                action: submitPassword,
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

function submitPassword(e) {
    var doc = { 'password': e.input };

    $.ajax({
        'url': '/forms',
        'type': 'POST',
        'dataType': 'json', // type of data sent back from server
        'data': doc
    })
        .done(accessFormsPage);
}

// create a POST request with the form data when the submit button is pressed
function submitFormData() {
    var farmName = getFarmName();
    var farmTypes = getFarmTypes();

    var doc = {'farmName': farmName,
               'farmTypes': farmTypes};
    $.ajax({
        'url': '/content',
        'type': 'POST',
        'data': doc
    })
        .done(redirectPage);
}

function redirectPage() {
    if (confirm("Success: your page has been modified\n\n Click ok to be redirected to your page")) {
        // redirects user to the related (newly modified) content page if he clicks "ok"
        // does nothing if presses cancel
        window.location = "/" + farmName;  // redirect to the content page related to this farm
    }
}
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

// function to be called upon completing ajax post request
function accessFormsPage(doc) {
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

