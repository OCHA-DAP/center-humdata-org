(function() {
	var counter = window.counter = {
		TARGETDATE: new Date('2017,2,1'),

		countdown: function(){
			var today = new Date();
			var oneDay = 24*60*60*1000;
			var daysLeft = Math.round(Math.abs((counter.TARGETDATE.getTime() - today.getTime())/(oneDay)));
			return daysLeft;
		}
	}
})();