define(['jquery'],function($) {

	function NumOperator(){

		//private variables
		var _MINNUM = 1;
		var _MAXNUM = 10;
		var _NUM = 10;
		var _$container;
		var _$num;
		var _$minus;
		var _$plus;

		//private methods
		var add = function(){
			_NUM = (_NUM >= _MAXNUM) ? _MAXNUM : ++_NUM;
		}
		var subtract = function(){
			_NUM = (_NUM <= _MINNUM) ? _MINNUM : --_NUM;
		}
		var updateUI = function(){
			_$minus.removeClass('disabled');
			_$plus.removeClass('disabled');
			if (_NUM === _MINNUM) {
				_$minus.addClass('disabled');
			}
			else if (_NUM === _MAXNUM) {
				_$plus.addClass('disabled');
			} 
			_$num.html(_NUM); 
		}


		//public methods
		this.init = function(minNum,maxNum){
			_MINNUM = minNum;
			_MAXNUM = maxNum;
		}
		this.setNum = function(num){
			if(num >= _MAXNUM) {
				_NUM = _MAXNUM;
			}
			else if(num <= _MINNUM) {
				_NUM = _MINNUM;
			}
			else {
				_NUM = num;
			}
			updateUI();
		}
		this.getNum = function(){
			return _NUM;
		}

		this.initUI = function($container){
			_$container = $container;
			_$num = _$container.find('.number');
			_$minus = _$container.find('.minus');  
			_$plus = _$container.find('.plus'); 
		}

		this.bindEvent = function(callBack){
			_$container.on('click','.minus:not(.disabled)', function(){
				subtract();
				updateUI();
				callBack&&callBack(_NUM);
			});
			_$container.on('click','.plus:not(.disabled)', function(){
				add();
				updateUI();
				callBack&&callBack(_NUM);
			});
		}

	}
	return NumOperator;
});