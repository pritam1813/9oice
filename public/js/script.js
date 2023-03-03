/* Nav Menu button events */
$('#loginnav').click(function(){
    location.href = '/user/login'
});

$('#signupnav').click(function(){
    location.href = '/user/signup'
});

$('#logoutnav').click(function(){
    location.href = '/user/logout'
});

(function() {

	$('#live-chat header').on('click', function() {

		$('.chat').slideToggle(300, 'swing');
		$('.chat-message-counter').fadeToggle(300, 'swing');

	});

	$('.chat-close').on('click', function(e) {

		e.preventDefault();
		$('#live-chat').fadeOut(300);

	});

}) ();