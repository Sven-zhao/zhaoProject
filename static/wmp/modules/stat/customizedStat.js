define(['modules/net/wAjax'],function(wAjax){

	function CustomizedStat(settings) {
		this.url = settings.url || '';
		this.type = settings.type || 'post';
		this.data = settings.data || {};
		this.success = settings.success || undefined;
		this.error = settings.error || undefined;
	}
	CustomizedStat.prototype = {
		constructor: CustomizedStat,
		stat: function() {
			wAjax({
	            url: this.url,
	            type: this.type,
	            data: this.data,
	            success: function(obj){
	            	this.success&&this.success(obj);
	            },
	            error: function(obj) {         
	               this.error&&this.error(obj);
	            }
	        }); 
		}
	}

	return CustomizedStat;

});