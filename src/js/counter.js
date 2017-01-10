(function() {
	var counter = window.counter = {
		TARGETDATE: new Date('March 29, 2017'),

		countdown: function(){
			var today = new Date();
			console.log(counter.TARGETDATE, today);
			var oneDay = 24*60*60*1000;
			var daysLeft = Math.round(Math.abs((counter.TARGETDATE.getTime() - today.getTime())/(oneDay)));
			return daysLeft;
		}
	}
})();