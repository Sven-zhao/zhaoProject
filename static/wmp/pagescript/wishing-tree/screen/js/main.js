require(['jquery', 'modules/net/wAjax', 'pagescript/wishing-tree/screen/js/runner', 'pagescript/wishing-tree/screen/js/dataqueue'], function ($, ajax, CardRunner, Queue) {

	var bgmStart = document.getElementById('bgm-start');
	var bgmLoop = document.getElementById('bgm-loop');
	var openMusic = document.getElementById('open-music');


	bgmStart.addEventListener('ended', function () {
		bgmLoop.play();
	});

	bgmLoop.loop = true;
	
	var $banner = $('.banner');
	var queue = new Queue({
		segLength: 16 
	});

	var runner = new CardRunner({
		selector: '#cards',
		delay: 200
	});

	setInterval(function(){
		updateQueStat();
	},1000)

	var autoSign = 0;
	function autoRun() {
		showNextSeg();
		autoSign = setInterval(function(){
			if(!runner.running) {
				showNextSeg();
			}
		},4000);
	}	

	function showNextSeg() {
		var dataArr = queue.getNextSeg();
		runner.setData(dataArr);			
	}

	function showPrevSeg() {
		var dataArr = queue.getPrevSeg();
		runner.setData(dataArr);			
	}

	var $monitor = $('.monitor');
	function updateQueStat() {
		$monitor.find('.cur').html(queue._pointer);	
		$monitor.find('.all').html(queue._dataArr.length);	
	}


	$(window).on('keyup',function(evt){
		var keyCode = evt.keyCode;
		console.log(keyCode);
		if(keyCode == 32) {
			/*
			 * 空格
			 */
			$('.banner').removeClass('show');
			$wrap.removeClass('blur');			
			if(autoSign != 0) {
				clearInterval(autoSign);
				autoSign = 0;
				$('.state').removeClass('play').addClass('pause');
			} else if(!runner.running) {
				autoRun();
				$('.state').removeClass('pause').addClass('play');
			}
		} else if(keyCode == 79) {
			/*
			 * O 键 
			 */
			if (!runner.running && $('.card.show').length == 0) {
				OkeyIsPushed = true;
				$banner.addClass('show');
				bgmStart.play();
			}

		} else if(keyCode == 38) {
			/*
			 * 上 
			 */
			if(!runner.running) {
				console.log('prev');
				var dataArr = queue.getPrevSeg();
				runner.setDataBatch(dataArr);			
			}
		} else if(keyCode == 40) {
			/*
			 * 下 
			 */
			if(!runner.running) {
				console.log('next');
				var dataArr = queue.getNextSeg();
				runner.setDataBatch(dataArr);			
			}
		} else if(keyCode == 77) {
			/*
			 * M 
			 */
			if(!runner.running) {
				clearInterval(autoSign);
				runner.hideAll();
				setTimeout(function(){
					$('.banner').addClass('show');
				},2000);
			}
		} 
	});


	var $preview = $('.preview-wrap'),
		$wrap = $('.wrap');

	$preview.on('click',function(){
		$(this).fadeOut();
		$wrap.removeClass('blur');
		bgmLoop.play();
	});

	$('.card').on('click',function(){
		var $this = $(this);
		$preview.find('.user-name').html($this.find('.content').html());
		$preview.find('.content').html($this.find('.preview-content').html());
		$preview.fadeIn();
		bgmStart.pause();
		bgmLoop.pause();
		openMusic.play();
		$wrap.addClass('blur');			
	});


	getData('');
	function getData(lastId) {
		ajax({
			url: '/wmp/user/'+appConfigId+'/dream/pc/getAttendDreamUser',
			type: 'post',
			data: {
				lastId: lastId 
			},
			success: function(obj) {
				var data = obj['data'];
				queue.enQueue(data['list']);
				updateQueStat();
				setTimeout(function(){
					getData(data['lastId']);
				},10000);
			},
			generalError: function(obj) {
				console.log(obj);
				setTimeout(function(){
					console.log('正在重试');
					getData(lastId);
				},20000);
		    }
		});
	}

	window.runner = runner;
	window.queue = queue;
});
