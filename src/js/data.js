(function() {
	var data = window.data = {

		getData: function(url, callback){
			$.getJSON( url, function( d ) {
				$(document).trigger(callback ,d);
			});
		}
	};
})();