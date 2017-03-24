(function() {
	var counter = window.counter = {
		TARGETDATE: new Date('March 29, 2017'),

		countdown: function(){
			var today = new Date();
			var oneDay = 24*60*60*1000;
			var diff = counter.TARGETDATE.getTime() - today.getTime();
			var daysLeft = (diff<0) ? 0 : Math.round(diff/oneDay);
			return daysLeft;
		}
	}
})();