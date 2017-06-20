define([],function() {

	function CircleQueue(conf) {
		this._applyConf(conf);	
	}

	CircleQueue.prototype = {
		constructor: CircleQueue,
		_conf: {
			dataArr: null,
			pointer: 0,
		},
		_applyConf: function(conf) {
			var setting = this._conf;
			for (var key in setting) {
				if(conf[key] != undefined) {
					setting[key] = conf[key];
				}
			}
		},
		getNext: function() {
			var arr = this._conf.dataArr,
				pointer = this._conf.pointer,
				length = arr.length;
			var curEle = arr[pointer];
			if(pointer + 1 < length) {
				pointer = pointer + 1;	
			} else {
				pointer = 0;
			}
			this._conf.pointer = pointer;
			return curEle;
		}			
	}

	return CircleQueue;
});
