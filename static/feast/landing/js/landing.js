function ajustFont(){
	var html = document.documentElement;
    	html.style["fontSize"] = html.offsetWidth / 18.75 + "px";
}
function getLink(){
	var btn = document.querySelector('.load-link'),
		link1 = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zhisland.android.blog&g_f=991653',
		link2 = 'http://www.zhisland.com/data/client/android/zhisland.apk',
		link3 = 'https://itunes.apple.com/us/app/zheng-he-dao/id525751375?mt=8';

		window.isWeiXin = navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1;
		window.isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
		window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") != -1;
		
	if(isWeiXin){
		btn.href = link1;
	}else{
		if(isIOS){
			btn.href = link3;
		}else{
			btn.href = link2;
		}
	}
	btn.onclick = function(){
		this.className = "load-link load-link-on"
	}
	btn.ontouchstart = function(){
		this.className = "load-link load-link-on"
	}
	btn.ontouchend = function(){
		this.className = "load-link"
	}
}
window.onload = function(){
	ajustFont();
	getLink();
};
window.resize = ajustFont;