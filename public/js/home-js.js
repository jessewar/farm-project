// Execute when document is loaded
$(document).ready(function() {
  buttonClick();
});

// Changes navbar buttons when pressed
var buttonClick = function() {
  $('.nav-button').on('click', function() {
    $('.nav-button.active').removeClass('active'); // find active button and turn inactive
    $(this).addClass('active');
  });
};

// Sets scrollspy to detect position in body and alter navbar "active" accordingly
// Uses id's of areas on page that are also navbar href targets
$('body').scrollspy({target: '.navbar'});
