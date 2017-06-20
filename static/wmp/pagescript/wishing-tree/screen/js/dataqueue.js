define([],function(){
	function DataQueue(conf) {
		this._dataArr = [];
		this._applyConf(conf);	
	}
	DataQueue.prototype = {
		constructor: DataQueue,
		_dataArr: null,
		_pointer: 0,
		_pointerNextCache: null,
		_overflow: false,
		_underflow: false,
		_conf: {
			segLength: 16,
		},
		_applyConf: function(conf) {
			var setting = this._conf;
			for (var key in setting) {
				if(conf[key] != undefined) {
					setting[key] = conf[key];
				}
			}
		},
		enQueue: function( objArr ) {
			this._dataArr = this._dataArr.concat(objArr);
			if(this._underflow == true) {
				if(this._dataArr.length > this._pointer) {
					this._underflow = false;
				}
			}
		},
		getNextSeg: function() {
			var pointer = this._pointer,
				arrLength = this._dataArr.length,
				segLength = this._conf.segLength,
				endIndex = pointer + segLength,
				result;
			if(this._underflow == true) {
				result = [];	
			} else {
				this._pointerNextCache = this._pointer;
				if( endIndex > arrLength ) {
					this._underflow = true;
					this._pointer = arrLength;
				} else {
					this._pointer = endIndex;
				}
				if( this._overflow == true) {
					this._overflow = false;
				}
				result = this._dataArr.slice(pointer,endIndex);
			}
			return result;
		},
		getPrevSeg: function() {
			var arrLength = this._dataArr.length,
				segLength = this._conf.segLength,
				pointer = this._pointer,
				result,
				prePointer;
			if(this._overflow == true) {
				result = [];
			} else {
				if(this._underflow == true) {
					prePointer = this._pointerNextCache;
					this._underflow = false;
				} else {
					prePointer = pointer - segLength;	
				}
				if( prePointer - segLength  > 0 ) {
					this._pointer = prePointer;
					result = this._dataArr.slice(-(arrLength-prePointer+segLength),prePointer);
				} else {
					this._pointer = prePointer;
					this._overflow = true;			
					result = this._dataArr.slice(0,prePointer);
				}
			}

			return result;
		}
	}	
	return DataQueue;
});
