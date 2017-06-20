define( ['modules/stat/customizedStat'],function(CustomizedStat){

	function wxStat(settings) {
		var _wxStat = new CustomizedStat({
			url: '/wmp/user/' + settings.appConfigId+'/forward/record',
			type: 'get',
			data: settings.data
		});
		_wxStat.stat();
	}

	return wxStat;

});